package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.PaymentVerifyRequestDto;
import com.niteshgiri.AthleteArena.service.Interface.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create-order/{eventId}")
    public ResponseEntity<?> createOrder(@PathVariable String eventId) {
        try {
            return ResponseEntity.ok(bookingService.createOrder(eventId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", true, "message", "Order API failed"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody PaymentVerifyRequestDto dto) {
        try {
            return ResponseEntity.ok(bookingService.verifyPayment(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "failed"));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> myBookings() {
        return ResponseEntity.ok(bookingService.myBookings());
    }
}