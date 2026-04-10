package com.niteshgiri.AthleteArena.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageResponseDto {

    private String publicId;
    private String url;
    private String secureUrl;
    private String resourceType;
    private Long bytes;
    private String streamingUrl;
}