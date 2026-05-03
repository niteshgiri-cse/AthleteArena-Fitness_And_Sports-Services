package com.niteshgiri.AthleteArena.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentResponseDto {

    private String id;
    private String text;
    private String username;
    private String profileImageUrl;
}