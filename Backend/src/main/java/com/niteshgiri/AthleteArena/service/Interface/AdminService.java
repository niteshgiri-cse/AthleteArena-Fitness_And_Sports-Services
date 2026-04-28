package com.niteshgiri.AthleteArena.service.Interface;

import com.niteshgiri.AthleteArena.dto.request.AdminCourseRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminEventRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminRegisterRequestDto;
import com.niteshgiri.AthleteArena.dto.response.*;

import java.util.List;

public interface AdminService {
    AdminProfileResponseDto getAdminProfile();

    AdminEventResponseDto createEvent(AdminEventRequestDto adminEventRequestDto);

    AdminCourseResponseDto createCourse(AdminCourseRequestDto adminCourseRequestDto);

    AdminRegisterResponseDto registerNewAdmin(AdminRegisterRequestDto adminRegisterRequestDto);

    List<AdminUserDetailsResponseDto> getUserDetails();

    AdminProfileResponseDto updateProfile(AdminProfileRequestDto adminProfileRequestDto);
}
