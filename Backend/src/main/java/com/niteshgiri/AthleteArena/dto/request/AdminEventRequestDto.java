package com.niteshgiri.AthleteArena.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
public class AdminEventRequestDto {
    private String title;
    private LocalDateTime dataAndTime;
    private String location;
    private String status;
    private double registrationFees;
    private long capacity;
    private MultipartFile imageUrl;
}
