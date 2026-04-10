package com.niteshgiri.AthleteArena.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "likes")
@Getter
@Setter
@Builder
public class Like {

    @Id
    private String id;

    private String userId;
    private String postId;

    private Instant createdAt;
}
