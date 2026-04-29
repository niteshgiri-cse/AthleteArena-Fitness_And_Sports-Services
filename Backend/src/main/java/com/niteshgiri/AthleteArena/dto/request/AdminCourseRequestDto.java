package com.niteshgiri.AthleteArena.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@Data
public class AdminCourseRequestDto {

    @NotNull(message = "Thumbnail is required")
    private MultipartFile thumbnail;
    private String courseTitle;
    @NotBlank(message = "video Title is required field")
    private String videoTitle;
    @Indexed(unique = true)
    @NotBlank(message = "videoId is required field")
    private String videoId;
    private String videoLink;
    private Set<String> tags=new HashSet<>();



}
