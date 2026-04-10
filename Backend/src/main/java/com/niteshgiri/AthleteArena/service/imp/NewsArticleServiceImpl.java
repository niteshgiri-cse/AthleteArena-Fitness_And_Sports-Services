package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.response.NewsArticleResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.NewsArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NewsArticleServiceImpl implements NewsArticleService {

    @Value("${NEWS-API-KEY}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public List<NewsArticleResponseDto> getAllArticle() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate fromDate = today.minusDays(15);
            LocalDate toDate = today.minusDays(1);

            String url = "https://newsapi.org/v2/everything" +
                    "?q=sports OR olympics OR fitness OR competition" +
                    "&from=" + fromDate +
                    "&to=" + toDate +
                    "&sortBy=publishedAt" +
                    "&language=en" +
                    "&pageSize=20" +
                    "&apiKey=" + secretKey;

            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            List<Map<String, Object>> articles =
                    (List<Map<String, Object>>) response.get("articles");

            List<NewsArticleResponseDto> result = new ArrayList<>();
            int id = 1;

            for (Map<String, Object> article : articles) {
                if (article.get("urlToImage") == null || article.get("url") == null) {
                    continue;
                }

                Map<String, Object> sourceMap = (Map<String, Object>) article.get("source");

                result.add(
                        NewsArticleResponseDto.builder()
                                .id(String.valueOf(id++))
                                .title((String) article.get("title"))
                                .image((String) article.get("urlToImage"))
                                .url((String) article.get("url"))
                                .category("Sports")
                                .source(sourceMap != null ? (String) sourceMap.get("name") : null)
                                .author((String) article.get("author"))
                                .publishedAt(formatDate((String) article.get("publishedAt")))
                                .build()
                );
            }

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