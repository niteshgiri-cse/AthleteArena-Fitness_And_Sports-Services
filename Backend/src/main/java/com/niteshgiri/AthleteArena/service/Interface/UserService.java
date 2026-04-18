package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.model.User;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {

    UserProfileResponseDto getUserProfile();

   List<MediaResponseDto> userPost();

    UserProfileResponseDto updateUserProfile(UserProfileRequestDto userProfileRequestDto);

    void createProfile(User savedUser);
}
