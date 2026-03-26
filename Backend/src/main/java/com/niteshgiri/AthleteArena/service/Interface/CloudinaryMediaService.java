package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.CloudinaryUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryMediaService {

    CloudinaryUploadResponseDto uploadImage(MultipartFile file) throws IOException;

    CloudinaryUploadResponseDto uploadVideo(MultipartFile file) throws IOException;

    CloudinaryUploadResponseDto updateImage(String publicId, MultipartFile file) throws IOException;

    void deleteMedia(String publicId, String resourceType) throws IOException;

    String generateVideoStreamingUrl(String publicId);
}