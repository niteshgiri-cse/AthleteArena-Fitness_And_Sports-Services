package com.niteshgiri.AthleteArena.model;

import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import com.niteshgiri.AthleteArena.model.type.MediaType;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "media_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaPost {

    @Id
    private String id;

    private String userId;

    private String title;
    private String description;

    private String publicId;
    private String url;
    private String secureUrl;

    private MediaType mediaType;

    @Builder.Default
    private Set<MediaCategory> categories = new HashSet<>();

    @Builder.Default
    private Set<String> tags = new HashSet<>();

    @Builder.Default
    private Set<String> likes = new HashSet<>();

    private int commentCount;
    private int viewCount;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}