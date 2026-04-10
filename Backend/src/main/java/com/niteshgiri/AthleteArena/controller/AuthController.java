package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.LoginRequestDto;
import com.niteshgiri.AthleteArena.dto.response.LoginResponseDto;
import com.niteshgiri.AthleteArena.dto.request.SignUpRequestDto;
import com.niteshgiri.AthleteArena.dto.response.SignupResponseDto;
import com.niteshgiri.AthleteArena.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody @Valid SignUpRequestDto signUpRequestDto){
           return ResponseEntity.ok(authService.signup(signUpRequestDto));
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }
}
