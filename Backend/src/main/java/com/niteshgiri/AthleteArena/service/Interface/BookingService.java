package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.PaymentVerifyRequestDto;

public interface BookingService {
    Object createOrder(String eventId);

    Object verifyPayment(PaymentVerifyRequestDto dto);

    Object myBookings();

    Object handleWebhook(String payload, String signature);
}
