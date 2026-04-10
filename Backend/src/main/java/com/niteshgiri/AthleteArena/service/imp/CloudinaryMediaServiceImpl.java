package com.niteshgiri.AthleteArena.service.imp;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.niteshgiri.AthleteArena.dto.response.ImageResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryMediaServiceImpl implements CloudinaryMediaService {

    private final Cloudinary cloudinary;

    @Override
    public ImageResponseDto uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "folder", "athletearena/images",
                        "resource_type", "image",
                        "quality", "auto"
                )
        );
        return mapToResponse(result);
    }

    @Override
    public ImageResponseDto uploadVideo(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("video-", file.getOriginalFilename());
        file.transferTo(tempFile);

        Map<?, ?> result = cloudinary.uploader().uploadLarge(
                tempFile,
                Map.of(
                        "resource_type", "video",
                        "folder", "athletearena/videos",
                        "chunk_size", 20000000,
                        "eager", "sp_hd,sp_sd",
                        "eager_async", true
                )
        );

        tempFile.delete();

        String publicId = result.get("public_id").toString();

        return ImageResponseDto.builder()
                .publicId(publicId)
                .url(result.get("url").toString())
                .secureUrl(result.get("secure_url").toString())
                .resourceType(result.get("resource_type").toString())
                .bytes(Long.valueOf(result.get("bytes").toString()))
                .streamingUrl(generateVideoStreamingUrl(publicId))
                .build();
    }

    @Override
    public ImageResponseDto updateImage(String publicId, MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "public_id", publicId,
                        "overwrite", true,
                        "resource_type", "image"
                )
        );
        return mapToResponse(result);
    }

    public void deleteMedia(String publicId, String resourceType) throws IOException {
        cloudinary.uploader().destroy(
                publicId,
                Map.of("resource_type", resourceType)
        );
    }

    @Override
    public String generateVideoStreamingUrl(String publicId) {
        return cloudinary.url()
                .resourceType("video")
                .format("m3u8")
                .transformation(new Transformation<>()
                        .streamingProfile("full_hd")
                        .quality("auto")
                        .fetchFormat("auto"))
                .generate(publicId);
    }

    private ImageResponseDto mapToResponse(Map<?, ?> map) {
        String publicId = map.get("public_id").toString();
        return ImageResponseDto.builder()
                .publicId(publicId)
                .url(map.get("url").toString())
                .secureUrl(map.get("secure_url").toString())
                .resourceType(map.get("resource_type").toString())
                .bytes(Long.valueOf(map.get("bytes").toString()))
                .streamingUrl(generateVideoStreamingUrl(publicId))
                .build();
    }
}