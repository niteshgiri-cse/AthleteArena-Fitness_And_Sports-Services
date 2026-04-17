package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(){
        UserProfileResponseDto user=userService.getUserProfile();
      return  ResponseEntity.ok(user);
    }

    @GetMapping("/posts")
    public ResponseEntity<List<MediaResponseDto>> userPost(){
        List<MediaResponseDto> video=userService.userPost();
        return ResponseEntity.ok(video);
    }
//    @PostMapping("/createProfile")
//    public ResponseEntity<UserProfileResponseDto> createProfile(@RequestBody @Valid UserProfileRequestDto userProfileRequestDto){
//       UserProfileResponseDto userProfileResponseDto= userService.createProfile(userProfileRequestDto);
//      return ResponseEntity.status(HttpStatus.CREATED).body(userProfileResponseDto);
//    }


}
