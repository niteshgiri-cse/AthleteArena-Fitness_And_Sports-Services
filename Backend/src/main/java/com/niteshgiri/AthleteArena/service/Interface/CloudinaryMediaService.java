package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.response.ImageResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryMediaService {

    ImageResponseDto uploadImage(MultipartFile file) throws IOException;

    ImageResponseDto uploadVideo(MultipartFile file) throws IOException;

    ImageResponseDto updateImage(String publicId, MultipartFile file) throws IOException;

    void deleteMedia(String publicId, String resourceType) throws IOException;

    String generateVideoStreamingUrl(String publicId);
}