package com.niteshgiri.AthleteArena.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.GetMapping;

@Document(collection = "user_Profile")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfile {
    @Id
    private String id;

    private String userId;

    private String name;
    private String bio;
    private String sport;
    private String profileImageUrl;
    private int followersCount;
    private int followingCount;
}
