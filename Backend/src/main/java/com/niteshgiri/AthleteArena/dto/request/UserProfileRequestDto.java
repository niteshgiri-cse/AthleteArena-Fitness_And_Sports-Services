package com.niteshgiri.AthleteArena.dto.request;
import lombok.Data;

import java.util.Set;

@Data
public class UserProfileRequestDto {

    private String name;
    private String bio;
    private Set<String> tags;
    private String profileImageUrl;
    private String backgroundImageUrl;
}
