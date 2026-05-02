package com.niteshgiri.AthleteArena.model;

import com.niteshgiri.AthleteArena.model.type.BookingStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "registrations")
@CompoundIndex(name = "user_event_unique", def = "{'userId': 1, 'eventId': 1}", unique = true)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Registration {

    @Id
    private String id;

    private String userId;
    private String eventId;

    private BookingStatus status;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    private double amount;

    private LocalDateTime createdAt;
}