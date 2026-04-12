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
import org.modelmapper.ModelMapper;
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
    private final ModelMapper modelMapper;

    private String getUserEmail(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    public UserProfileResponseDto getUserProfile() {
        String email=getUserEmail();
    User user= userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found"));
    UserProfile userProfile=userProfileRepository.findByUserId(user.getId()).orElseThrow(()-> new UsernameNotFoundException(
            "user" +
            " " +
            "Profile" +
            " not" +
            " exist"));
        return UserProfileResponseDto.builder()

                .name(userProfile.getName())
                .email(user.getEmail())
                .bio(userProfile.getBio())
                .sport(userProfile.getSport())
                .profileImageUrl(userProfile.getProfileImageUrl())
                .followingCount(userProfile.getFollowingCount())
                .followersCount(userProfile.getFollowersCount())
                .createdAt(userProfile.getCreatedAt())
                .build();
    }

    @Override
    public List<MediaResponseDto> userPost() {
        User user=userRepository.findByEmail(getUserEmail()).orElseThrow(()-> new UsernameNotFoundException("user " +
                "not found "));
        List<MediaPost> mediaPosts=mediaRepository.findByUserId(user.getId());
        return mediaPosts.stream()
                .map(media -> MediaResponseDto.builder()
                        .id(media.getId())
                        .url(media.getUrl())
                        .mediaType(media.getMediaType().name())
                        .categories(media.getCategories())
                        .tags(media.getTags())
                        .title(media.getTitle())
                        .description(media.getDescription())
                        .createdAt(
                                LocalDateTime.ofInstant(
                                        media.getCreatedAt(),
                                        java.time.ZoneId.systemDefault()
                                )
                        )
                        .build())
                .toList();
    }


    @Override
    public UserProfileResponseDto createProfile(UserProfileRequestDto userProfileRequestDto) {
        User user=userRepository.findByEmail(getUserEmail()).orElseThrow(()-> new UsernameNotFoundException("User not" +
                " exist"));
        UserProfile userProfile=UserProfile.builder()
                .userId(user.getId())
                .name(userProfileRequestDto.getName())
                .bio(userProfileRequestDto.getBio())
                .sport(userProfileRequestDto.getSport())
                .username(userProfileRequestDto.getUsername())
                .profileImageUrl(userProfileRequestDto.getProfileImageUrl())
                .followersCount(0)
                .followingCount(0)
                .build();
        UserProfile userProfile1=userProfileRepository.save(userProfile);
     return  modelMapper.map(userProfile1,UserProfileResponseDto.class);
    }
}
