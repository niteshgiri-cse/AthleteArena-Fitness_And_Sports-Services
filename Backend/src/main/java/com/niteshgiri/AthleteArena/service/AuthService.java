package com.niteshgiri.AthleteArena.service;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.request.LoginRequestDto;
import com.niteshgiri.AthleteArena.dto.response.LoginResponseDto;
import com.niteshgiri.AthleteArena.dto.request.SignUpRequestDto;
import com.niteshgiri.AthleteArena.dto.response.SignupResponseDto;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.type.RoleType;
import com.niteshgiri.AthleteArena.model.type.UserStatus;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserService userService;
    @Transactional
    public SignupResponseDto signup(SignUpRequestDto signUpRequestDto) {
        Optional<User> existingUser = userRepository.findByEmail(signUpRequestDto.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }
        User user = new User();
        user.setName(signUpRequestDto.getName());
        user.setEmail(signUpRequestDto.getEmail());
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode(signUpRequestDto.getPassword()));
        user.setRoles(Collections.singleton(RoleType.valueOf("USER")));
        User savedUser = userRepository.save(user);

        userService.createProfile(savedUser);
        String token=authUtil.generateAccessToken(savedUser);
        SignupResponseDto response= modelMapper.map(savedUser, SignupResponseDto.class);
        response.setJwt(token);
        return response;
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );
        User user = (User) authentication.getPrincipal();
        String token = authUtil.generateAccessToken(user);
        return new LoginResponseDto(user.getId(), token);
    }
}

