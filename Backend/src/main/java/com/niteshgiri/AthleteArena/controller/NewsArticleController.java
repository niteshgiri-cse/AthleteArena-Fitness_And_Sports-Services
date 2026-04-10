package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.response.NewsArticleResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.NewsArticleService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsArticleController {
    private final NewsArticleService newsArticleService;
    @GetMapping("/article")
    ResponseEntity<List<NewsArticleResponseDto>> getAllArticle() {
        List<NewsArticleResponseDto> res = newsArticleService.getAllArticle();
        return ResponseEntity.ok(res);
    }
}
