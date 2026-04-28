package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.*;
import com.niteshgiri.AthleteArena.dto.response.*;
import com.niteshgiri.AthleteArena.service.Interface.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileResponseDto> getAdminProfile() {
        return ResponseEntity.ok(adminService.getAdminProfile());
    }

    @PutMapping(value = "/update-details", consumes = "multipart/form-data")
    public ResponseEntity<AdminProfileResponseDto> updateProfile(
            @ModelAttribute AdminProfileRequestDto dto) {

        return ResponseEntity.ok(adminService.updateProfile(dto));
    }

    @PostMapping(value = "/create-event", consumes = "multipart/form-data")
    public ResponseEntity<AdminEventResponseDto> createEvent(
            @ModelAttribute AdminEventRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createEvent(dto));
    }

    @PostMapping(value = "/create-course", consumes = "multipart/form-data")
    public ResponseEntity<AdminCourseResponseDto> createCourse(
            @ModelAttribute AdminCourseRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createCourse(dto));
    }

    @GetMapping("/get-users-details")
    public ResponseEntity<List<AdminUserDetailsResponseDto>> getUserDetails() {
        return ResponseEntity.ok(adminService.getUserDetails());
    }

    @PostMapping("/register-new-admin")
    public ResponseEntity<AdminRegisterResponseDto> registerNewAdmin(
            @RequestBody AdminRegisterRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.registerNewAdmin(dto));
    }
}