package com.niteshgiri.AthleteArena.service.imp;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.niteshgiri.AthleteArena.dto.CloudinaryUploadResponseDto;
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
    public CloudinaryUploadResponseDto uploadImage(MultipartFile file)throws IOException{
        Map<?,?> result=cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "folder","athletearena/images",
                        "resource_type","image",
                        "quality","auto"
                )
        );
        return mapToResponse(result);
    }

    @Override
    public CloudinaryUploadResponseDto uploadVideo(MultipartFile file)throws IOException{
        File tempFile=File.createTempFile("video",file.getOriginalFilename());
        file.transferTo(tempFile);
        Map<?,?> result=cloudinary.uploader().upload(
                tempFile,
                Map.of(
                        "resource_type","video",
                        "folder","athletearena/videos",
                        "chunk_size",6000000,
                        "transformation",new Transformation()
                                .quality("auto")
                                .fetchFormat("mp4")
                                .width(1280)
                                .height(720)
                                .crop("limit")
                )
        );
        tempFile.delete();
        return mapToResponse(result);
    }

    @Override
    public CloudinaryUploadResponseDto updateImage(String publicId,MultipartFile file)throws IOException{
        Map<?,?> result=cloudinary.uploader().upload(
                file.getBytes(),
                Map.of(
                        "public_id",publicId,
                        "overwrite",true,
                        "resource_type","image"
                )
        );
        return mapToResponse(result);
    }

    public void deleteMedia(String publicId,String resourceType)throws IOException{
        cloudinary.uploader().destroy(
                publicId,
                Map.of("resource_type",resourceType)
        );
    }
    @Override
    public String generateVideoStreamingUrl(String publicId){
        return cloudinary.url()
                .resourceType("video")
                .format("m3u8")
                .transformation(new Transformation()
                        .quality("auto")
                        .fetchFormat("auto")
                        .videoCodec("auto")
                        .bitRate("auto")
                        .streamingProfile("auto"))
                .generate(publicId);
    }

    private CloudinaryUploadResponseDto mapToResponse(Map<?,?> map){
        return CloudinaryUploadResponseDto.builder()
                .publicId(map.get("public_id").toString())
                .url(map.get("url").toString())
                .secureUrl(map.get("secure_url").toString())
                .resourceType(map.get("resource_type").toString())
                .bytes(Long.valueOf(map.get("bytes").toString()))
                .build();
    }
}