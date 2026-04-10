package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupResponseDto {
    private String id;
    private String name;
    private String jwt;
}
