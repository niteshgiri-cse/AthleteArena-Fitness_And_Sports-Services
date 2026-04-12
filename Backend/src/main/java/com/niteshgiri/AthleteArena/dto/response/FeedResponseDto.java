package com.niteshgiri.AthleteArena.dto.response;

import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FeedResponseDto {
    private String id;
    private String url;
    private String username;
    private String userId;
    private String mediaType;
    private Set<MediaCategory> categories;
    private Set<String> tags;
    private String title;
    private String description;
    private int commentCount;
    private int likeCount;
    private LocalDateTime createdAt;
}
