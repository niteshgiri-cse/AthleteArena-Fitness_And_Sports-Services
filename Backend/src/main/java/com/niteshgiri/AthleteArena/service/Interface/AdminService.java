package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.AdminCourseRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminEventRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminRegisterRequestDto;
import com.niteshgiri.AthleteArena.dto.response.*;

import java.io.IOException;
import java.util.List;

public interface AdminService {
    AdminProfileResponseDto getAdminProfile();

    EventResponseDto createEvent(AdminEventRequestDto adminEventRequestDto);

    CourseResponseDto createCourse(AdminCourseRequestDto adminCourseRequestDto);

    AdminRegisterResponseDto registerNewAdmin(AdminRegisterRequestDto adminRegisterRequestDto);

    List<AdminUserDetailsResponseDto> getUserDetails();

    AdminProfileResponseDto updateProfile(AdminProfileRequestDto adminProfileRequestDto);
    // COURSE
    void deleteCourse(String videoId) throws IOException;
    CourseResponseDto updateCourse(String videoId, AdminCourseRequestDto dto);

    // EVENT
    void deleteEvent(String eventId) throws IOException;
    EventResponseDto updateEvent(String eventId, AdminEventRequestDto dto);
}
