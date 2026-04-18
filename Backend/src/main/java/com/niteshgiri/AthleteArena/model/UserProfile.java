package com.niteshgiri.AthleteArena.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

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
    private String bio;
    private String profileImageUrl;
    private String backgroundImageUrl;
    private Set<String> followers=new HashSet<>();
    private Set<String> following=new HashSet<>();
    private Set<String> tags=new HashSet<>();
    @CreatedDate
    private Instant createdAt;
}
