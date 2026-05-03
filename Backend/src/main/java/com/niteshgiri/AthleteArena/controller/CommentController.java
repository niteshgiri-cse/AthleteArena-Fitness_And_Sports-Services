package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.request.CommentRequestDto;
import com.niteshgiri.AthleteArena.dto.response.CommentResponseDto;
import com.niteshgiri.AthleteArena.model.Comment;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.UserProfile;
import com.niteshgiri.AthleteArena.repository.CommentRepository;
import com.niteshgiri.AthleteArena.repository.UserProfileRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @PostMapping("/{postId}")
    public void addComment(@PathVariable String postId,
                           @RequestBody CommentRequestDto request) {

        String userId = authUtil.getLoggedInUserId();

        commentRepository.save(
                Comment.builder()
                        .postId(postId)
                        .userId(userId)
                        .content(request.getText())
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    @GetMapping("/{postId}")
    public List<CommentResponseDto> getComments(@PathVariable String postId) {

        List<Comment> comments =
                commentRepository.findByPostIdOrderByCreatedAtDesc(postId);

        return comments.stream().map(comment -> {

            User user = userRepository.findById(comment.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserProfile profile = userProfileRepository
                    .findByUserId(user.getId())
                    .orElse(null);

            return CommentResponseDto.builder()
                    .id(comment.getId())
                    .text(comment.getContent())
                    .username(user.getUsername())
                    .profileImageUrl(
                            profile != null ? profile.getProfileImageUrl() : null
                    )
                    .build();

        }).toList();
    }
}