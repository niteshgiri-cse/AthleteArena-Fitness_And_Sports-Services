package com.niteshgiri.AthleteArena.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminRegisterResponseDto {
    private String id;
    private String adminId;
    private String name;
    private String role;
    private String email;
}
