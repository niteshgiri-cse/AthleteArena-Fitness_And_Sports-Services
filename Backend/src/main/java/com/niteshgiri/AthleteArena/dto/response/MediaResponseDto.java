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
    private String publicId;
    private String url;
    private String secureUrl;
    private String mediaType;
    private String userId;
    private Set<MediaCategory> categories;
    private Set<String> tags;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}