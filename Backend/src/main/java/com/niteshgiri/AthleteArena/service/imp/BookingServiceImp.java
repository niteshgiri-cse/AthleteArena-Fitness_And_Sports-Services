package com.niteshgiri.AthleteArena.service.imp;

import com.mongodb.DuplicateKeyException;
import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.request.PaymentVerifyRequestDto;
import com.niteshgiri.AthleteArena.dto.response.BookingHistoryResponseDto;
import com.niteshgiri.AthleteArena.model.*;
import com.niteshgiri.AthleteArena.model.type.BookingStatus;
import com.niteshgiri.AthleteArena.repository.*;
import com.niteshgiri.AthleteArena.service.EmailService;
import com.niteshgiri.AthleteArena.service.Interface.BookingService;
import com.niteshgiri.AthleteArena.util.EmailTemplateUtil;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingServiceImp implements BookingService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final RazorpayClient razorpayClient;
    private final AuthUtil authUtil;
    private final EmailService emailService;

    @Value("${razorpay.secret}")
    private String razorpaySecret;
    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    @Override
    public Object createOrder(String eventId) {

        String userId = authUtil.getLoggedInUserId();

        if (registrationRepository.existsByUserIdAndEventIdAndStatus(
                userId, eventId, BookingStatus.CONFIRMED)) {
            return Map.of("error", true, "message", "Already Registered");
        }

        Event event = eventRepository.findById(eventId).orElseThrow();

        if (registrationRepository.countByEventIdAndStatus(eventId, BookingStatus.CONFIRMED)
                >= event.getCapacity()) {
            return Map.of("error", true, "message", "Event Full");
        }

        try {
            JSONObject options = new JSONObject();
            options.put("amount", (int)(event.getRegistrationFees() * 100));
            options.put("currency", "INR");

            Order order = razorpayClient.orders.create(options);

            Registration reg = Registration.builder()
                    .userId(userId)
                    .eventId(eventId)
                    .status(BookingStatus.PENDING)
                    .razorpayOrderId(order.get("id"))
                    .amount(event.getRegistrationFees())
                    .createdAt(LocalDateTime.now())
                    .build();

            registrationRepository.save(reg);

            return Map.of(
                    "error", false,
                    "orderId", order.get("id"),
                    "amount", order.get("amount"),
                    "key", razorpayKey
            );

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                    "error", true,
                    "message", "Order creation failed"
            );
        }
    }
    @Override
    public Object verifyPayment(PaymentVerifyRequestDto dto) {

        Registration reg = registrationRepository
                .findByRazorpayOrderId(dto.getOrderId())
                .orElseThrow();

        boolean valid = verifySignature(
                dto.getOrderId(),
                dto.getPaymentId(),
                dto.getSignature()
        );

        if (!valid) {
            reg.setStatus(BookingStatus.FAILED);
            registrationRepository.save(reg);
            return Map.of("status", "failed");
        }

        reg.setStatus(BookingStatus.CONFIRMED);
        reg.setRazorpayPaymentId(dto.getPaymentId());
        registrationRepository.save(reg);

        return Map.of("status", "success");
    }

    @Override
    public Object myBookings() {
        String userId = authUtil.getLoggedInUserId();

        return registrationRepository.findByUserId(userId)
                .stream()
                .map(reg -> {
                    Event event = eventRepository.findById(reg.getEventId()).orElseThrow();
                    return BookingHistoryResponseDto.builder()
                            .eventTitle(event.getTitle())
                            .status(reg.getStatus().name())
                            .amount(reg.getAmount())
                            .date(reg.getCreatedAt())
                            .build();
                }).toList();
    }

    @Override
    public Object handleWebhook(String payload, String signature) {

        if (!verifyWebhookSignature(payload, signature)) {
            throw new RuntimeException("Invalid webhook");
        }

        JSONObject json = new JSONObject(payload);

        // ✅ SUCCESS
        if ("payment.captured".equals(json.getString("event"))) {

            JSONObject payment = json.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String orderId = payment.getString("order_id");
            String paymentId = payment.getString("id");

            Registration reg = registrationRepository
                    .findByRazorpayOrderId(orderId)
                    .orElseThrow();

            reg.setStatus(BookingStatus.CONFIRMED);
            reg.setRazorpayPaymentId(paymentId);
            registrationRepository.save(reg);

            Event event = eventRepository.findById(reg.getEventId()).get();
            User user = userRepository.findById(reg.getUserId()).get();

            // 📧 email
            String html = EmailTemplateUtil.buildSuccessEmail(user, event, reg);
            emailService.sendHtmlEmail(user.getEmail(), "Booking Confirmed", html);

            // 🔔 notification
            notificationRepository.save(
                    Notification.builder()
                            .userId(user.getId())
                            .message("Your booking for " + event.getTitle() + " is confirmed")
                            .read(false)
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }

        // ❌ FAILURE
        if ("payment.failed".equals(json.getString("event"))) {

            JSONObject payment = json.getJSONObject("payload")
                    .getJSONObject("payment")
                    .getJSONObject("entity");

            String orderId = payment.getString("order_id");

            Registration reg = registrationRepository
                    .findByRazorpayOrderId(orderId)
                    .orElseThrow();

            reg.setStatus(BookingStatus.FAILED);
            registrationRepository.save(reg);
        }

        return "ok";
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256"));

            return Hex.encodeHexString(mac.doFinal(payload.getBytes())).equals(signature);

        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(), "HmacSHA256"));

            return Hex.encodeHexString(mac.doFinal(payload.getBytes())).equals(signature);

        } catch (Exception e) {
            throw new RuntimeException();
        }
    }
}