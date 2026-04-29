package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.response.CourseResponseDto;

import com.niteshgiri.AthleteArena.service.Interface.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;
    @GetMapping("/get-All-video")
    public ResponseEntity<List<CourseResponseDto>> getAllVideo(){
       List<CourseResponseDto> courseResponseDto= courseService.getAllVideo();
        return ResponseEntity.ok(courseResponseDto);
    }
    @GetMapping("/{videoId}")
    public ResponseEntity<CourseResponseDto> getVideoById(@PathVariable String videoId) {
        CourseResponseDto response = courseService.getVideoById(videoId);
        return ResponseEntity.ok(response);
    }
    




}
