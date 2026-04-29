package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResponseDto {
    private String id;
    private String title;
    private LocalDateTime dataAndTime;
    private String location;
    private String status;
    private long capacity;
    private double registrationFees;
    private String imageUrl;
}
