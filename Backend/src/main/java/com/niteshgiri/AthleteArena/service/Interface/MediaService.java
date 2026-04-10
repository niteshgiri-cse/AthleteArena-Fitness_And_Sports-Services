package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface MediaService {

    MediaResponseDto uploadImage(
            MultipartFile file,
            String title,
            String description,
            Set<MediaCategory> categories,
            Set<String> tags
    ) throws IOException;

    MediaResponseDto uploadVideo(
            MultipartFile file,
            String title,
            String description,
            Set<MediaCategory> categories,
            Set<String> tags
    ) throws IOException;

    List<MediaResponseDto> getMyMedia();

    List<MediaResponseDto> getMyImages();

    List<MediaResponseDto> getMyVideos();

    List<MediaResponseDto> getFeed();

    void deleteMedia(String mediaId) throws IOException;
}