package com.niteshgiri.AthleteArena.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticleResponseDto {

    private String id;
    private String title;
    private String image;
    private String url;
    private String category;
    private String source;
    private String author;
    private String publishedAt;
}