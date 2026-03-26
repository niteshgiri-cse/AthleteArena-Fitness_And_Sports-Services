package com.niteshgiri.AthleteArena.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CloudinaryUploadResponseDto {

    private String publicId;
    private String url;
    private String secureUrl;
    private String resourceType;
    private Long bytes;
}
