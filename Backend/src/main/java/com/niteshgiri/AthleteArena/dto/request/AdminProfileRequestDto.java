package com.niteshgiri.AthleteArena.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AdminProfileRequestDto {
    private String name;
    private String email;
    private String phone;
    private MultipartFile profileUrl;
    private String location;
}

