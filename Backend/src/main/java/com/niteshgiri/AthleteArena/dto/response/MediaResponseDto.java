package com.niteshgiri.AthleteArena.dto.response;

import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class MediaResponseDto {

    private String id;
    private String profileImageUrl;
    private String username;
    private String url;
    private String mediaType;
    private Set<MediaCategory> categories;
    private Set<String> tags;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}