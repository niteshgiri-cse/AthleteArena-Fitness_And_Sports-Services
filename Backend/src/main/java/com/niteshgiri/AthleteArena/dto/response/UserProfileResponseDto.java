package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;


import java.time.Instant;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponseDto {

    private String name;
    private String email;
    private String bio;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private int followersCount;
    private int followingCount;
    private Instant createdAt;
}
