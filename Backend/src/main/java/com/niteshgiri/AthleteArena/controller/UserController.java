package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.VideoRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getUserProfile() {
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @GetMapping("/posts")
    public ResponseEntity<List<MediaResponseDto>> userPost() {
        return ResponseEntity.ok(userService.userPost());
    }

    @PutMapping(value = "/update-profile", consumes = "multipart/form-data")
    public ResponseEntity<UserProfileResponseDto> updateUserProfile(
            @ModelAttribute UserProfileRequestDto dto) {

        return ResponseEntity.ok(userService.updateUserProfile(dto));
    }
    @PutMapping(value = "/update-post/{postId}", consumes = "multipart/form-data")
    public ResponseEntity<MediaResponseDto> updatePost(
            @PathVariable String postId,
            @ModelAttribute VideoRequestDto dto) {

        return ResponseEntity.ok(userService.updatePost(postId, dto));
    }

    @DeleteMapping("/delete-post/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String postId) {

        userService.deletePostById(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfileResponseDto> getUserProfileById(
            @PathVariable String userId) {

        return ResponseEntity.ok(userService.getUserProfileById(userId));
    }
    @PostMapping("/follow/{userId}")
    public void followUser(@PathVariable String userId) {
        userService.toggleFollow(userId);
    }
}