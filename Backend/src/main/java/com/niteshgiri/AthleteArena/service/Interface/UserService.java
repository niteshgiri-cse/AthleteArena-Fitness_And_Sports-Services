package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface UserService {

    UserProfileResponseDto getUserProfile();

   List<MediaResponseDto> userPost();

    UserProfileResponseDto createProfile(@Valid UserProfileRequestDto userProfileRequestDto);
}
