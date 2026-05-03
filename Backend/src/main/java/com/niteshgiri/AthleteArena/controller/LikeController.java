package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.model.Like;
import com.niteshgiri.AthleteArena.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeRepository likeRepository;
    private final AuthUtil authUtil;

    @PostMapping("/{postId}")
    public void toggleLike(@PathVariable String postId) {

        String userId = authUtil.getLoggedInUserId();

        boolean exists = likeRepository.existsByPostIdAndUserId(postId, userId);

        if (exists) {
            likeRepository.deleteByPostIdAndUserId(postId, userId);
        } else {
            likeRepository.save(
                    Like.builder()
                            .postId(postId)
                            .userId(userId)
                            .createdAt(Instant.now())
                            .build()
            );
        }
    }
}