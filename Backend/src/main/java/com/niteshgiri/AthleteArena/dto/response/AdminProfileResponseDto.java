package com.niteshgiri.AthleteArena.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProfileResponseDto {
    private String id;
    private String name;
    private String role;
    private String email;
    private String phone;
    private String profileUrl;
    private String location;
}
