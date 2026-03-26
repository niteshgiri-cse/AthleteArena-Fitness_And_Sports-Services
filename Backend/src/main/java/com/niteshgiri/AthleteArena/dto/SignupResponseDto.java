package com.niteshgiri.AthleteArena.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupResponseDto {
    private Long id;
    private String name;
    private String jwt;
}
