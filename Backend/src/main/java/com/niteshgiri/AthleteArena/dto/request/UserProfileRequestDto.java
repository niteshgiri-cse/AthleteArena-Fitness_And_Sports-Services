package com.niteshgiri.AthleteArena.dto.request;


import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserProfileRequestDto {
    @NotEmpty(message="Enter you name")
    private String name;
    private String username;
    private String bio;
    private String sport;
    private String profileImageUrl;
}
