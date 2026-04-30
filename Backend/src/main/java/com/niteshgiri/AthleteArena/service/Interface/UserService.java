package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.VideoRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.model.User;

import java.util.List;

public interface UserService {

    UserProfileResponseDto getUserProfile();

   List<MediaResponseDto> userPost();

    UserProfileResponseDto updateUserProfile(UserProfileRequestDto userProfileRequestDto);

    void createProfile(User savedUser);

    MediaResponseDto updatePost(String postId, VideoRequestDto dto);

    void deletePostById(String postId);
}
