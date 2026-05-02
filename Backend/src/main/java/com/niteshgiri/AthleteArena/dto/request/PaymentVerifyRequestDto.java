package com.niteshgiri.AthleteArena.dto.request;

import lombok.Data;

@Data
public class PaymentVerifyRequestDto {
    private String orderId;
    private String paymentId;
    private String signature;
}
