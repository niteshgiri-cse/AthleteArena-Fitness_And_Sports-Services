package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.MediaResponseDto;
import com.niteshgiri.AthleteArena.entity.type.MediaCategory;
import com.niteshgiri.AthleteArena.service.Interface.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController{

    private final MediaService mediaService;

    @PostMapping("/image")
    public ResponseEntity<MediaResponseDto> uploadImage(@RequestParam("file") MultipartFile file,@RequestParam String title,@RequestParam String description,@RequestParam MediaCategory category,@RequestParam(required=false) Set<String> tags)throws IOException{
        return ResponseEntity.ok(mediaService.uploadImage(file,title,description,category,tags));
    }

    @PostMapping("/video")
    public ResponseEntity<MediaResponseDto> uploadVideo(@RequestParam("file") MultipartFile file,
                                                        @RequestParam String title,@RequestParam String description,@RequestParam MediaCategory category,@RequestParam(required=false) Set<String> tags)throws IOException{
        return ResponseEntity.ok(mediaService.uploadVideo(file,title,description,category,tags));
    }

    @GetMapping("/me")
    public ResponseEntity<List<MediaResponseDto>> getMyMedia(){
        return ResponseEntity.ok(mediaService.getMyMedia());
    }

    @GetMapping("/me/images")
    public ResponseEntity<List<MediaResponseDto>> getMyImages(){
        return ResponseEntity.ok(mediaService.getMyImages());
    }

    @GetMapping("/me/videos")
    public ResponseEntity<List<MediaResponseDto>> getMyVideos(){
        return ResponseEntity.ok(mediaService.getMyVideos());
    }

    @GetMapping("/feed")
    public ResponseEntity<List<MediaResponseDto>> getFeed(){
        return ResponseEntity.ok(mediaService.getFeed());
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<String> deleteMedia(@PathVariable String mediaId) throws IOException {
        mediaService.deleteMedia(mediaId);
        return ResponseEntity.ok("Deleted successfully");
    }
}