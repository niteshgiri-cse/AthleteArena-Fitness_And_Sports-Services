package com.niteshgiri.AthleteArena.service.imp;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.niteshgiri.AthleteArena.dto.response.FileResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryMediaServiceImpl implements CloudinaryMediaService {

    private final Cloudinary cloudinary;

    // ================= IMAGE UPLOAD =================
    @Override
    public FileResponseDto uploadImage(MultipartFile file) throws IOException {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "athletearena/images");
            options.put("resource_type", "image");
            options.put("quality", "auto");

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    options
            );

            return mapToResponse(result);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    // ================= VIDEO UPLOAD (OPTIMIZED) =================
    @Override
    public FileResponseDto uploadVideo(MultipartFile file) throws IOException {

        try {
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "video");
            options.put("folder", "athletearena/videos");

            options.put("chunk_size", 10 * 1024 * 1024);


            options.put("quality", "auto");
            options.put("fetch_format", "auto");
            Map<?, ?> result = cloudinary.uploader().uploadLarge(
                    file.getInputStream(),
                    options
            );

            String publicId = result.get("public_id").toString();

            return FileResponseDto.builder()
                    .publicId(publicId)
                    .url(result.get("url").toString())
                    .secureUrl(result.get("secure_url").toString())
                    .resourceType(result.get("resource_type").toString())
                    .bytes(Long.valueOf(result.get("bytes").toString()))
                    .streamingUrl(generateAdaptiveStreamingUrl(publicId))
                    .thumbnailUrl(generateThumbnail(publicId)) // optional
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Video upload failed: " + e.getMessage());
        }
    }

    // ================= UPDATE IMAGE =================
    @Override
    public FileResponseDto updateImage(String publicId, MultipartFile file) throws IOException {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("public_id", publicId);
            options.put("overwrite", true);
            options.put("resource_type", "image");

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    options
            );

            return mapToResponse(result);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Image update failed: " + e.getMessage());
        }
    }

    // ================= DELETE =================
    @Override
    public void deleteMedia(String publicId, String resourceType) throws IOException {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", resourceType);

            cloudinary.uploader().destroy(publicId, options);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }

    // ================= ADAPTIVE STREAMING =================
    @Override
    public String generateAdaptiveStreamingUrl(String publicId) {
        return cloudinary.url()
                .resourceType("video")
                .format("m3u8") // HLS streaming
                .transformation(new Transformation<>()
                        .streamingProfile("auto") // 🔥 adaptive bitrate
                        .quality("auto")
                        .fetchFormat("auto"))
                .generate(publicId);
    }

    // ================= THUMBNAIL =================
    public String generateThumbnail(String publicId) {
        return cloudinary.url()
                .resourceType("video")
                .format("jpg")
                .transformation(new Transformation<>()
                        .width(480)
                        .height(270)
                        .crop("fill")
                        .quality("auto"))
                .generate(publicId);
    }

    // ================= COMMON MAPPER =================
    private FileResponseDto mapToResponse(Map<?, ?> map) {
        String publicId = map.get("public_id").toString();

        return FileResponseDto.builder()
                .publicId(publicId)
                .url(map.get("url").toString())
                .secureUrl(map.get("secure_url").toString())
                .resourceType(map.get("resource_type").toString())
                .bytes(Long.valueOf(map.get("bytes").toString()))
                .streamingUrl(generateAdaptiveStreamingUrl(publicId))
                .thumbnailUrl(generateThumbnail(publicId))
                .build();
    }
}