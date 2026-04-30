package com.niteshgiri.AthleteArena.dto.response;

import lombok.Data;

@Data
public class AdminUserDetailsResponseDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String status;
}
