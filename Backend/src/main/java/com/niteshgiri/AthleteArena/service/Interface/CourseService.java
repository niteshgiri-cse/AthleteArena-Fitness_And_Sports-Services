package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.response.CourseResponseDto;

import java.util.List;

public interface CourseService {
    CourseResponseDto getVideoById(String videoId);

    List<CourseResponseDto> getAllVideo();
}
