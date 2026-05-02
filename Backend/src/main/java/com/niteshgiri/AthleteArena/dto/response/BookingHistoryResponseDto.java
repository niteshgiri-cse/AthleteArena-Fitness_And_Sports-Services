package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BookingHistoryResponseDto {
    private String eventTitle;
    private String status;
    private Double amount;
    private LocalDateTime date;
}
