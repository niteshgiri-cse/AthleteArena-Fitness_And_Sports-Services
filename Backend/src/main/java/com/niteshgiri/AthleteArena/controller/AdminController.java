package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.request.*;
import com.niteshgiri.AthleteArena.dto.response.*;
import com.niteshgiri.AthleteArena.service.Interface.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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
    public ResponseEntity<EventResponseDto> createEvent(
            @ModelAttribute AdminEventRequestDto dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.createEvent(dto));
    }

    @PostMapping(value = "/create-course", consumes = "multipart/form-data")
    public ResponseEntity<CourseResponseDto> createCourse(
           @Valid @ModelAttribute AdminCourseRequestDto dto) {

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

    // ================= COURSE =================

    // DELETE COURSE
    @DeleteMapping("/course/{videoId}")
    public ResponseEntity<String> deleteCourse(@PathVariable String videoId) throws IOException {
        adminService.deleteCourse(videoId);
        return ResponseEntity.ok("Course deleted successfully");
    }

    // UPDATE COURSE
    @PutMapping(value = "/course/{videoId}", consumes = "multipart/form-data")
    public ResponseEntity<CourseResponseDto> updateCourse(
            @PathVariable String videoId,
            @ModelAttribute AdminCourseRequestDto dto) {

        return ResponseEntity.ok(adminService.updateCourse(videoId, dto));
    }


// ================= EVENT =================

    // DELETE EVENT
    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable String eventId) throws IOException {
        adminService.deleteEvent(eventId);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // UPDATE EVENT
    @PutMapping(value = "/event/{eventId}", consumes = "multipart/form-data")
    public ResponseEntity<EventResponseDto> updateEvent(
            @PathVariable String eventId,
            @ModelAttribute AdminEventRequestDto dto) {

        return ResponseEntity.ok(adminService.updateEvent(eventId, dto));
    }



}