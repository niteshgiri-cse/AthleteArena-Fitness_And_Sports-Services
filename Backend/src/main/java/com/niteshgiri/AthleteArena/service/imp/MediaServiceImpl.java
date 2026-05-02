package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.response.FeedResponseDto;
import com.niteshgiri.AthleteArena.dto.response.FileResponseDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.model.MediaPost;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.type.MediaCategory;
import com.niteshgiri.AthleteArena.model.type.MediaType;
import com.niteshgiri.AthleteArena.repository.CommentRepository;
import com.niteshgiri.AthleteArena.repository.LikeRepository;
import com.niteshgiri.AthleteArena.repository.MediaRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import com.niteshgiri.AthleteArena.service.Interface.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final CloudinaryMediaService cloudinaryService;
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final AuthUtil authUtil;

    private User getCurrentUser() {
        String email = authUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User Not Found"));
    }

    private Set<MediaCategory> resolveCategories(Set<MediaCategory> categories) {
        Set<MediaCategory> finalCategories = new HashSet<>();
        finalCategories.add(MediaCategory.SPORTS);
        if (categories != null && !categories.isEmpty()) {
            finalCategories.addAll(categories);
        }
        return finalCategories;
    }

    private MediaResponseDto mapToDto(MediaPost media) {
        return MediaResponseDto.builder()
                .id(media.getId())
                .url(media.getUrl())
                .mediaType(media.getMediaType().name())
                .categories(media.getCategories())
                .tags(media.getTags())
                .title(media.getTitle())
                .description(media.getDescription())
                .createdAt(media.getCreatedAt()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime())
                .build();
    }

    @Override
    public MediaResponseDto uploadImage(
            MultipartFile file,
            String title,
            String description,
            Set<MediaCategory> categories,
            Set<String> tags
    ) throws IOException {

        User user = getCurrentUser();
        FileResponseDto res = cloudinaryService.uploadImage(file);

        MediaPost media = MediaPost.builder()
                .publicId(res.getPublicId())
                .url(res.getUrl())
                .secureUrl(res.getSecureUrl())
                .mediaType(MediaType.IMAGE)
                .userId(user.getId())
                .title(title)
                .description(description)
                .categories(resolveCategories(categories))
                .tags(tags != null ? tags : new HashSet<>())
                .createdAt(Instant.now())
                .build();

        return mapToDto(mediaRepository.save(media));
    }

    @Override
    public MediaResponseDto uploadVideo(
            MultipartFile file,
            String title,
            String description,
            Set<MediaCategory> categories,
            Set<String> tags
    ) throws IOException {

        User user = getCurrentUser();
        FileResponseDto res = cloudinaryService.uploadVideo(file);

        MediaPost media = MediaPost.builder()
                .publicId(res.getPublicId())
                .url(res.getUrl())
                .secureUrl(res.getSecureUrl())
                .mediaType(MediaType.VIDEO)
                .userId(user.getId())
                .title(title)
                .description(description)
                .categories(resolveCategories(categories))
                .tags(tags != null ? tags : new HashSet<>())
                .createdAt(Instant.now())
                .build();

        return mapToDto(mediaRepository.save(media));
    }

    @Override
    public Page<FeedResponseDto> getFeed(int page, int size) {

        Page<MediaPost> mediaPage =
                mediaRepository.findAll(
                        PageRequest.of(page, size, Sort.by("createdAt").descending())
                );

        return mediaPage.map(media -> {

            User user = userRepository.findById(media.getUserId()).orElseThrow();

            int commentCount = commentRepository.countByPostId(media.getId());
            int likeCount = likeRepository.countByPostId(media.getId());

            return new FeedResponseDto(
                    media.getId(),
                    media.getUrl(),
                    user.getUsername(),
                    user.getId(),
                    media.getMediaType().name(),
                    media.getCategories(),
                    media.getTags(),
                    media.getTitle(),
                    media.getDescription(),
                    commentCount,
                    likeCount,
                    media.getCreatedAt()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime()
            );
        });
    }

    @Override
    public void deleteMedia(String mediaId) throws IOException {
        User user = getCurrentUser();

        MediaPost media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found"));

        if (!media.getUserId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        cloudinaryService.deleteMedia(
                media.getPublicId(),
                media.getMediaType().name().toLowerCase()
        );

        mediaRepository.delete(media);
    }
}