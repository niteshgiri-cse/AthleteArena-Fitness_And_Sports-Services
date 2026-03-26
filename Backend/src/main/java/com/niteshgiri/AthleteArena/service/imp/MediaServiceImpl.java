package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.CloudinaryUploadResponseDto;
import com.niteshgiri.AthleteArena.dto.MediaResponseDto;
import com.niteshgiri.AthleteArena.entity.Media;
import com.niteshgiri.AthleteArena.entity.User;
import com.niteshgiri.AthleteArena.entity.type.MediaCategory;
import com.niteshgiri.AthleteArena.entity.type.MediaType;
import com.niteshgiri.AthleteArena.repository.MediaRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import com.niteshgiri.AthleteArena.service.Interface.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class MediaServiceImpl implements MediaService{

    private final CloudinaryMediaService cloudinaryService;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    private User getCurrentUser(){
        String email=authUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private MediaResponseDto mapToDto(Media media){
        return MediaResponseDto.builder()
                .id(media.getId())
                .publicId(media.getPublicId())
                .url(media.getUrl())
                .secureUrl(media.getSecureUrl())
                .mediaType(media.getMediaType().name())
                .userId(media.getUser().getId())
                .category(media.getCategory().name())
                .tags(media.getTags())
                .title(media.getTitle())
                .description(media.getDescription())
                .createdAt(media.getCreatedAt())
                .build();
    }

    @Override
    public MediaResponseDto uploadImage(MultipartFile file,String title,String description,MediaCategory category,Set<String> tags)throws IOException{
        User user=getCurrentUser();
        CloudinaryUploadResponseDto res=cloudinaryService.uploadImage(file);
        Media media=Media.builder()
                .publicId(res.getPublicId())
                .url(res.getUrl())
                .secureUrl(res.getSecureUrl())
                .mediaType(MediaType.IMAGE)
                .user(user)
                .title(title)
                .description(description)
                .category(category)
                .tags(tags)
                .createdAt(LocalDateTime.now())
                .build();
        return mapToDto(mediaRepository.save(media));
    }

    @Override
    public MediaResponseDto uploadVideo(MultipartFile file,String title,String description,MediaCategory category,
                                        Set<String> tags)throws IOException{
        User user=getCurrentUser();
        CloudinaryUploadResponseDto res=cloudinaryService.uploadVideo(file);
        Media media=Media.builder()
                .publicId(res.getPublicId())
                .url(res.getUrl())
                .secureUrl(res.getSecureUrl())
                .mediaType(MediaType.VIDEO)
                .user(user)
                .title(title)
                .category(category)
                .description(description)
                .tags(tags)
                .createdAt(LocalDateTime.now())
                .build();
        return mapToDto(mediaRepository.save(media));
    }

    @Override
    public List<MediaResponseDto> getMyMedia(){
        return mediaRepository.findByUser_Id(getCurrentUser().getId()).stream().map(this::mapToDto).toList();
    }

    @Override
    public List<MediaResponseDto> getMyImages(){
        return mediaRepository.findByUser_IdAndMediaType(getCurrentUser().getId(),MediaType.IMAGE).stream().map(this::mapToDto).toList();
    }

    @Override
    public List<MediaResponseDto> getMyVideos(){
        return mediaRepository.findByUser_IdAndMediaType(getCurrentUser().getId(),MediaType.VIDEO).stream().map(this::mapToDto).toList();
    }

    @Override
    public List<MediaResponseDto> getFeed(){
        return mediaRepository.getFeed().stream().map(this::mapToDto).toList();
    }

    @Override
    public void deleteMedia(String mediaId) throws IOException {

        User user = getCurrentUser();

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        if (!media.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }
        cloudinaryService.deleteMedia(
                media.getPublicId(),
                media.getMediaType().name().toLowerCase()
        );
        mediaRepository.delete(media);
    }
}