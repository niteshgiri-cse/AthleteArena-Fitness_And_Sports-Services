package com.niteshgiri.AthleteArena.dto.response;

import lombok.Data;

@Data
public class AdminRegisterResponseDto {
    private String id;
    private String adminId;
    private String name;
    private String role;
    private String email;
}
