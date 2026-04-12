package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.response.FeedResponseDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import com.niteshgiri.AthleteArena.service.Interface.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/image")
    public ResponseEntity<MediaResponseDto> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<MediaCategory> categories,
            @RequestParam(required = false) Set<String> tags
    ) throws IOException {

        return ResponseEntity.ok(
                mediaService.uploadImage(file, title, description, categories, tags)
        );
    }

    @PostMapping("/video")
    public ResponseEntity<MediaResponseDto> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<MediaCategory> categories,
            @RequestParam(required = false) Set<String> tags
    ) throws IOException {

        return ResponseEntity.ok(
                mediaService.uploadVideo(file, title, description, categories, tags)
        );
    }


    @GetMapping("/feed")
    public Page<FeedResponseDto> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return mediaService.getFeed(page, size);
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<String> deleteMedia(@PathVariable String mediaId) throws IOException {
        mediaService.deleteMedia(mediaId);
        return ResponseEntity.ok("Deleted successfully");
    }
}