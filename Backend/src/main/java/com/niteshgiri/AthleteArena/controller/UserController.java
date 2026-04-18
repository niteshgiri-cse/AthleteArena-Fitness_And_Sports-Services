    package com.niteshgiri.AthleteArena.controller;

    import com.niteshgiri.AthleteArena.dto.request.UserProfileRequestDto;
    import com.niteshgiri.AthleteArena.dto.response.MediaResponseDto;
    import com.niteshgiri.AthleteArena.dto.response.UserProfileResponseDto;
    import com.niteshgiri.AthleteArena.service.Interface.UserService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/user")
    @RequiredArgsConstructor
    public class UserController {

        private final UserService userService;

        @GetMapping("/profile")
        public ResponseEntity<UserProfileResponseDto> getUserProfile() {
            return ResponseEntity.ok(userService.getUserProfile());
        }

        @GetMapping("/posts")
        public ResponseEntity<List<MediaResponseDto>> userPost() {
            return ResponseEntity.ok(userService.userPost());
        }

        @PutMapping("/update-profile")
        public ResponseEntity<UserProfileResponseDto> updateUserProfile(
                @RequestBody UserProfileRequestDto userProfileRequestDto) {

            return ResponseEntity.ok(
                    userService.updateUserProfile(userProfileRequestDto)
            );
        }
    }