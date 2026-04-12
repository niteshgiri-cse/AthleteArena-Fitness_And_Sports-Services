package com.niteshgiri.AthleteArena.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "user_Profile")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfile {
    @Id
    private String id;
    @NotBlank(message = "User Id is Required Filed")
    @NotEmpty
    private String userId;
    @NotBlank(message = "Enter you name ")
    private String name;
    @Indexed(unique = true)
    private String username;
    private String bio;
    private String sport;
    private String profileImageUrl;
    private int followersCount;
    private int followingCount;
    @CreatedDate
    private Instant createdAt;
}
