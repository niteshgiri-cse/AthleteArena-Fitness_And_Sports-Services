package com.niteshgiri.AthleteArena.dto.request;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
public class UserProfileRequestDto {

    private String name;
    private String bio;
    private Set<String> tags;
    private MultipartFile profileImageUrl;
    private MultipartFile backgroundImageUrl;
}
