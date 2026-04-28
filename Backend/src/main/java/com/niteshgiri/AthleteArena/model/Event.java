package com.niteshgiri.AthleteArena.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.Instant;
import java.time.LocalDateTime;

@Document(collection = "events")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    @Id
    private String id;
    private String title;
    private String publicId;
    private LocalDateTime dataAndTime;
    private String location;
    private String status;
    private long capacity;
    private double registrationFees;
    private String imageUrl;
}
