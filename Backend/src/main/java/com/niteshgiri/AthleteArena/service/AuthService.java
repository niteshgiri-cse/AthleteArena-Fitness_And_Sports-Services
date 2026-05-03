package com.niteshgiri.AthleteArena.service;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import com.niteshgiri.AthleteArena.dto.request.LoginRequestDto;
import com.niteshgiri.AthleteArena.dto.request.SignUpRequestDto;
import com.niteshgiri.AthleteArena.dto.response.LoginResponseDto;
import com.niteshgiri.AthleteArena.dto.response.SignupResponseDto;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.type.RoleType;
import com.niteshgiri.AthleteArena.model.type.UserStatus;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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
    public SignupResponseDto signup(SignUpRequestDto dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        String cleanName = dto.getName().trim().replaceAll("\\s+", "");
        String username = cleanName + "_" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        User user = new User();
        user.setName(dto.getName().trim());
        user.setUsername(username);
        user.setEmail(email);
        user.setStatus(UserStatus.ACTIVE);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRoles(new HashSet<>(Collections.singleton(RoleType.USER)));

        User savedUser = userRepository.save(user);

        userService.createProfile(savedUser);

        String token = authUtil.generateAccessToken(savedUser);

        SignupResponseDto response = modelMapper.map(savedUser, SignupResponseDto.class);
        response.setJwt(token);

        return response;
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getEmail().trim().toLowerCase(),
                            dto.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();

            String token = authUtil.generateAccessToken(user);

            return new LoginResponseDto(
                    user.getId(),
                    token,
                    user.getRoles()
            );

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password");
        }
    }

    // OPTIONAL (only if you really want separate admin login)
    public LoginResponseDto adminLogin(LoginRequestDto dto) {
        LoginResponseDto response = login(dto);

        User user = userRepository.findById(response.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRoles().contains(RoleType.ADMIN)) {
            throw new RuntimeException("Access denied: Admin only");
        }

        return response;
    }
}