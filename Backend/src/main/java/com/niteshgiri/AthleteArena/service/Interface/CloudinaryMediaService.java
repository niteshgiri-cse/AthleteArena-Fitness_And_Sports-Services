package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.response.FileResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryMediaService {

    FileResponseDto uploadImage(MultipartFile file) throws IOException;

    FileResponseDto uploadVideo(MultipartFile file) throws IOException;

    FileResponseDto updateImage(String publicId, MultipartFile file) throws IOException;

    void deleteMedia(String publicId, String resourceType) throws IOException;

    String generateAdaptiveStreamingUrl(String publicId);
}