package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.VideoRequestDto;
import com.niteshgiri.AthleteArena.dto.response.FileResponseDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.model.MediaPost;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.UserProfile;
import com.niteshgiri.AthleteArena.repository.MediaRepository;
import com.niteshgiri.AthleteArena.repository.UserProfileRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final MediaRepository mediaRepository;
    private final CloudinaryMediaService cloudinaryMediaService;

    private String getUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    public UserProfileResponseDto getUserProfile() {
        User user = userRepository.findByEmail(getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User Profile not exist"));

        return mapToDto(user, profile);
    }

    @Override
    public List<MediaResponseDto> userPost() {
        User user = userRepository.findByEmail(getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("user not found"));

        List<MediaPost> mediaPosts = mediaRepository.findByUserId(user.getId());

        return mediaPosts.stream()
                .map(media -> MediaResponseDto.builder()
                        .id(media.getId())
                        .url(media.getUrl())
                        .mediaType(media.getMediaType().name())
                        .categories(media.getCategories())
                        .tags(media.getTags())
                        .title(media.getTitle())
                        .description(media.getDescription())
                        .createdAt(LocalDateTime.ofInstant(
                                media.getCreatedAt(),
                                java.time.ZoneId.systemDefault()))
                        .build())
                .toList();
    }

    @Override
    public UserProfileResponseDto updateUserProfile(UserProfileRequestDto dto) {

        User user = userRepository.findByEmail(getUserEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        try {

            if (dto.getName() != null && !dto.getName().isBlank()) {
                profile.setName(dto.getName());
            }

            if (dto.getBio() != null) {
                profile.setBio(dto.getBio());
            }

            if (dto.getTags() != null) {
                profile.setTags(dto.getTags());
            }

            if (dto.getProfileImageUrl() != null && !dto.getProfileImageUrl().isEmpty()) {

                FileResponseDto file = cloudinaryMediaService.uploadImage(dto.getProfileImageUrl());

                profile.setProfileImageUrl(file.getSecureUrl());
            }

            if (dto.getBackgroundImageUrl() != null && !dto.getBackgroundImageUrl().isEmpty()) {

                FileResponseDto file = cloudinaryMediaService.uploadImage(dto.getBackgroundImageUrl());

                profile.setBackgroundImageUrl(file.getSecureUrl());
            }

            UserProfile saved = userProfileRepository.save(profile);

            return mapToDto(user, saved);

        } catch (Exception e) {
            throw new RuntimeException("Profile update failed: " + e.getMessage());
        }
    }

    @Override
    public void createProfile(User user) {
        UserProfile userProfile = UserProfile.builder()
                .userId(user.getId())
                .name(user.getName())
                .createdAt(Instant.now())
                .build();

        userProfileRepository.save(userProfile);
    }

    @Override
    public void deletePostById(String postId) {

        MediaPost post = mediaRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findByEmail(getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 SECURITY CHECK
        if (!post.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        try {
            // 🔥 DELETE FROM CLOUDINARY FIRST
            if (post.getPublicId() != null) {
                cloudinaryMediaService.deleteMedia(
                        post.getPublicId(),
                        post.getMediaType().name().toLowerCase() // image / video
                );
            }
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary delete failed: " + e.getMessage());
        }
        mediaRepository.delete(post);
    }
    @Override
    public MediaResponseDto updatePost(String postId, VideoRequestDto dto) {

        MediaPost post = mediaRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findByEmail(getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!post.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        try {

            if (dto.getFile() != null && !dto.getFile().isEmpty()) {

                if (post.getPublicId() != null) {
                    cloudinaryMediaService.deleteMedia(
                            post.getPublicId(),
                            post.getMediaType().name().toLowerCase()
                    );
                }

                FileResponseDto fileRes;

                if (post.getMediaType().name().equalsIgnoreCase("IMAGE")) {
                    fileRes = cloudinaryMediaService.uploadImage(dto.getFile());
                } else {
                    fileRes = cloudinaryMediaService.uploadVideo(dto.getFile());
                }

                post.setPublicId(fileRes.getPublicId());
                post.setUrl(fileRes.getUrl());
                post.setSecureUrl(fileRes.getSecureUrl());
            }

            if (dto.getTitle() != null) post.setTitle(dto.getTitle());
            if (dto.getDescription() != null) post.setDescription(dto.getDescription());
            if (dto.getCategories() != null) post.setCategories(dto.getCategories());
            if (dto.getTags() != null) post.setTags(dto.getTags());

            MediaPost updated = mediaRepository.save(post);

            return MediaResponseDto.builder()
                    .id(updated.getId())
                    .title(updated.getTitle())
                    .description(updated.getDescription())
                    .url(updated.getUrl())
                    .mediaType(updated.getMediaType().name())
                    .categories(updated.getCategories())
                    .tags(updated.getTags())
                    .createdAt(LocalDateTime.ofInstant(
                            updated.getCreatedAt(),
                            java.time.ZoneId.systemDefault()))
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Update failed: " + e.getMessage());
        }
    }

    private UserProfileResponseDto mapToDto(User user, UserProfile profile) {
        return UserProfileResponseDto.builder()
                .userId(user.getId())
                .name(profile.getName())
                .email(user.getEmail())
                .bio(profile.getBio())
                .profileImageUrl(profile.getProfileImageUrl())
                .backgroundImageUrl(profile.getBackgroundImageUrl())
                .followersCount(profile.getFollowers().size())
                .followingCount(profile.getFollowing().size())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    @Override
    public UserProfileResponseDto getUserProfileById(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return UserProfileResponseDto.builder()
                .userId(user.getId())
                .name(profile.getName())
                .email(user.getEmail())
                .bio(profile.getBio())
                .profileImageUrl(profile.getProfileImageUrl())
                .backgroundImageUrl(profile.getBackgroundImageUrl())
                .followersCount(profile.getFollowers().size())
                .followingCount(profile.getFollowing().size())
                .createdAt(profile.getCreatedAt())
                .build();
    }
    @Override
    public void toggleFollow(String targetUserId) {

        String currentUserId = getUserEmail(); // or use AuthUtil

        if (currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        UserProfile currentUser = userProfileRepository
                .findByUserId(currentUserId)
                .orElseThrow();

        UserProfile targetUser = userProfileRepository
                .findByUserId(targetUserId)
                .orElseThrow();

        if (currentUser.getFollowing().contains(targetUserId)) {

            currentUser.getFollowing().remove(targetUserId);
            targetUser.getFollowers().remove(currentUserId);

        } else {

            currentUser.getFollowing().add(targetUserId);
            targetUser.getFollowers().add(currentUserId);
        }

        userProfileRepository.save(currentUser);
        userProfileRepository.save(targetUser);
    }

}