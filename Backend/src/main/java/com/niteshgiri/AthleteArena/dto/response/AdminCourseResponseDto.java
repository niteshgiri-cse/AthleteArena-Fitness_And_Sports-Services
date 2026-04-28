package com.niteshgiri.AthleteArena.dto.response;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;
@Data
public class AdminCourseResponseDto {
    private String id;
    private String thumbnail;
    private String courseTitle;
    private String videoTitle;
    private String videoLink;
    private Set<String> tags;
}
