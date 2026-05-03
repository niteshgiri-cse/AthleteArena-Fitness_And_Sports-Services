package com.niteshgiri.AthleteArena.dto.response;

import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedResponseDto {

    private String id;
    private String url;
    private String username;
    private String userId;
    private String profileImageUrl;

    private String mediaType;
    private Set<MediaCategory> categories;
    private Set<String> tags;

    private String title;
    private String description;

    private int commentCount;
    private int likeCount;

    private boolean isLiked;

    private LocalDateTime createdAt;
}