package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileResponseDto {

    private String publicId;
    private String url;
    private String secureUrl;
    private String resourceType;
    private Long bytes;
    private String streamingUrl;
    private String thumbnailUrl;
}