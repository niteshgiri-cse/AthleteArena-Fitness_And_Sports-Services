package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.response.CourseResponseDto;
import com.niteshgiri.AthleteArena.model.Course;
import com.niteshgiri.AthleteArena.repository.CourseRepository;
import com.niteshgiri.AthleteArena.service.Interface.CourseService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImp implements CourseService {
    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;
    @Override
    public CourseResponseDto getVideoById(String videoId) {
        Course course=courseRepository.findByVideoId(videoId).orElseThrow(()-> new RuntimeException("Video " +
                "is not exist"));
        return modelMapper.map(course,CourseResponseDto.class);
    }

    @Override
    public List<CourseResponseDto> getAllVideo() {
        List<Course> courses =courseRepository.findAll();
        return courses.stream().map(video-> CourseResponseDto.builder()
                .id(video.getId())
                .courseTitle(video.getCourseTitle())
                .videoTitle(video.getVideoTitle())
                .videoId(video.getVideoId())
                .thumbnail(video.getThumbnail())
                .videoLink(video.getVideoLink())
                .tags(video.getTags())
                .build()).toList();
    }
}
