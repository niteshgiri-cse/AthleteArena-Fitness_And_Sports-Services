package com.niteshgiri.AthleteArena.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AdminEventResponseDto {
    private String id;
    private String title;
    private LocalDateTime dataAndTime;
    private String location;
    private String status;
    private long capacity;
    private double registrationFees;
    private String imageUrl;
}
