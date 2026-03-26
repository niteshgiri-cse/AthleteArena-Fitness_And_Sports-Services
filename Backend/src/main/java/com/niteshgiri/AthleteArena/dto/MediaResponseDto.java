package com.niteshgiri.AthleteArena.dto;
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
    private Long userId;
    private String category;
    private Set<String> tags;
    private String title;
    private String description;
    private LocalDateTime createdAt;
}