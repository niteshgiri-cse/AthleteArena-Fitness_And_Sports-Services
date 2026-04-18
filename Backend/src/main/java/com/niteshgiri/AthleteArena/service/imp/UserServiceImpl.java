package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.model.MediaPost;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.UserProfile;
import com.niteshgiri.AthleteArena.repository.MediaRepository;
import com.niteshgiri.AthleteArena.repository.UserProfileRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final MediaRepository mediaRepository;

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
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        UserProfile profile = userProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User Profile not exist"));

        if (dto.getName() != null) {
            profile.setName(dto.getName());
        }
        if (dto.getBio() != null) {
            profile.setBio(dto.getBio());
        }
        if (dto.getProfileImageUrl() != null) {
            profile.setProfileImageUrl(dto.getProfileImageUrl());
        }
        if (dto.getBackgroundImageUrl() != null) {
            profile.setBackgroundImageUrl(dto.getBackgroundImageUrl());
        }
        if (dto.getTags() != null) {
            profile.setTags(dto.getTags());
        }

        userProfileRepository.save(profile);

        return mapToDto(user, profile);
    }

    @Override
    public void createProfile(User user) {
        UserProfile userProfile = UserProfile.builder()
                .userId(user.getId())
                .name(user.getName())
                .build();

        userProfileRepository.save(userProfile);
    }

    private UserProfileResponseDto mapToDto(User user, UserProfile profile) {
        return UserProfileResponseDto.builder()
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
}