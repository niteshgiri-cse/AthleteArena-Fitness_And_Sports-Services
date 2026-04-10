package com.niteshgiri.AthleteArena.dto.request;

import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class ImageRequestDto {

    private MultipartFile file;

    private String title;
    private String description;
    private Set<MediaCategory> categories = new HashSet<>();
    private Set<String> tags = new HashSet<>();
}