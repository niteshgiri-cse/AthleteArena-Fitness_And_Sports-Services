package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.response.NewsArticleResponseDto;

import java.util.List;

public interface NewsArticleService {
    public List<NewsArticleResponseDto> getAllArticle();
}
