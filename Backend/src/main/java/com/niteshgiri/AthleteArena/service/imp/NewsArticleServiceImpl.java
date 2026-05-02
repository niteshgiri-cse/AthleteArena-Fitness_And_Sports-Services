package com.niteshgiri.AthleteArena.service.imp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.niteshgiri.AthleteArena.dto.response.NewsArticleResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.NewsArticleService;
import com.niteshgiri.AthleteArena.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NewsArticleServiceImpl implements NewsArticleService {

    @Value("${news.api-key}")
    private String secretKey;

    private static final String NEWS_CACHE_KEY = "sports_news";

    private final RestTemplate restTemplate;
    private final RedisService redisService;

    @Override
    public List<NewsArticleResponseDto> getAllArticle() {

        List<NewsArticleResponseDto> cached =
                redisService.get(NEWS_CACHE_KEY, new TypeReference<List<NewsArticleResponseDto>>() {});

        if (cached != null && !cached.isEmpty()) {
            return cached;
        }

        try {
            LocalDate today = LocalDate.now();
            LocalDate from = today.minusDays(15);
            LocalDate to = today.minusDays(1);

            String url = "https://newsapi.org/v2/everything" +
                    "?q=sports OR olympics OR fitness OR competition" +
                    "&from=" + from +
                    "&to=" + to +
                    "&sortBy=publishedAt" +
                    "&language=en" +
                    "&pageSize=20" +
                    "&apiKey=" + secretKey;

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null || response.get("articles") == null) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> articles =
                    (List<Map<String, Object>>) response.get("articles");

            List<NewsArticleResponseDto> result = new ArrayList<>();
            int id = 1;

            for (Map<String, Object> article : articles) {
                if (article.get("urlToImage") == null || article.get("url") == null) continue;

                Map<String, Object> source =
                        (Map<String, Object>) article.get("source");

                result.add(
                        NewsArticleResponseDto.builder()
                                .id(String.valueOf(id++))
                                .title((String) article.get("title"))
                                .image((String) article.get("urlToImage"))
                                .url((String) article.get("url"))
                                .category("Sports")
                                .source(source != null ? (String) source.get("name") : null)
                                .author((String) article.get("author"))
                                .publishedAt(formatDate((String) article.get("publishedAt")))
                                .build()
                );
            }

            redisService.set(NEWS_CACHE_KEY, result, 43200L);

            return result;

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private String formatDate(String dateStr) {
        try {
            return dateStr.substring(0, 10);
        } catch (Exception e) {
            return "";
        }
    }
}