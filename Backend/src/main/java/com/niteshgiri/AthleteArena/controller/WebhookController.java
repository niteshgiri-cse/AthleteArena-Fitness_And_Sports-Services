package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.service.Interface.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    private final BookingService bookingService;

    @PostMapping("/razorpay")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {

        try {
            return ResponseEntity.ok(
                    bookingService.handleWebhook(payload, signature)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Webhook failed");
        }
    }
}