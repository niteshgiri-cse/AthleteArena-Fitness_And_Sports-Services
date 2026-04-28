package com.niteshgiri.AthleteArena.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@Data
public class AdminCourseRequestDto {
    private MultipartFile thumbnail;
    private String courseTitle;
    private String videoTitle;
    private String videoLink;
    private Set<String> tags=new HashSet<>();



}
