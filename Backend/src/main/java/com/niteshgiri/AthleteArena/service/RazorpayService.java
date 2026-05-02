package com.niteshgiri.AthleteArena.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayClient client;

    public Order createOrder(double amount, String receipt) throws Exception {
        JSONObject options = new JSONObject();
        options.put("amount", (int)(amount * 100));
        options.put("currency", "INR");
        options.put("receipt", receipt);
        options.put("payment_capture", 1);

        return client.orders.create(options);
    }
}