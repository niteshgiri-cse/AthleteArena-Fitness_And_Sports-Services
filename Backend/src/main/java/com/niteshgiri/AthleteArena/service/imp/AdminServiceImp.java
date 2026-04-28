package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.request.AdminCourseRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminEventRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminProfileRequestDto;
import com.niteshgiri.AthleteArena.dto.request.AdminRegisterRequestDto;
import com.niteshgiri.AthleteArena.dto.response.*;
import com.niteshgiri.AthleteArena.model.Admin;
import com.niteshgiri.AthleteArena.model.Course;
import com.niteshgiri.AthleteArena.model.Event;
import com.niteshgiri.AthleteArena.model.User;
import com.niteshgiri.AthleteArena.model.type.RoleType;
import com.niteshgiri.AthleteArena.model.type.UserStatus;
import com.niteshgiri.AthleteArena.repository.AdminRepository;
import com.niteshgiri.AthleteArena.repository.CourseRepository;
import com.niteshgiri.AthleteArena.repository.EventRepository;
import com.niteshgiri.AthleteArena.repository.UserRepository;
import com.niteshgiri.AthleteArena.service.Interface.AdminService;
import com.niteshgiri.AthleteArena.service.Interface.CloudinaryMediaService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;


@Service
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminServiceImp implements AdminService {
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final CloudinaryMediaService cloudinaryMediaService;
    private  final EventRepository eventRepository;
    private final CourseRepository courseRepository;

    private final ModelMapper modelMapper;
   private String getEmail(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
    private String generateCustomId(){
       return UUID.randomUUID().toString().substring(0,8).replace("-","").toUpperCase();
    }

    @Override
    public AdminProfileResponseDto getAdminProfile() {
       User user=userRepository.findByEmail(getEmail()).orElseThrow(() -> new UsernameNotFoundException("User not " +
                "Found"));
        Admin admin=adminRepository.findByEmail(user.getEmail()).orElseThrow(()-> new RuntimeException("Admin " +
                "Profile not exist"));
        return modelMapper.map(admin, AdminProfileResponseDto.class);
    }

    @Override
    public AdminEventResponseDto createEvent(AdminEventRequestDto dto) {

        String imageUrl = null;
        String publicId = null;

        try {
            if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
                var uploadResult = cloudinaryMediaService.uploadImage(dto.getImageUrl());
                imageUrl = uploadResult.getSecureUrl();
                publicId = uploadResult.getPublicId();
            }
        } catch (Exception e) {
            throw new RuntimeException("Event image upload failed");
        }

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDataAndTime(dto.getDataAndTime());
        event.setLocation(dto.getLocation());
        event.setRegistrationFees(dto.getRegistrationFees());
        event.setStatus(dto.getStatus());
        event.setPublicId(publicId);
        event.setCapacity(dto.getCapacity());
        event.setImageUrl(imageUrl);

        Event saved = eventRepository.save(event);

        return modelMapper.map(saved, AdminEventResponseDto.class);
    }

    @Override
    public AdminCourseResponseDto createCourse(AdminCourseRequestDto dto) {

        String thumbnailUrl = null;
        String publicId = null;

        try {
            if (dto.getThumbnail() != null && !dto.getThumbnail().isEmpty()) {
                var uploadResult = cloudinaryMediaService.uploadImage(dto.getThumbnail());
                thumbnailUrl = uploadResult.getSecureUrl();
                publicId=uploadResult.getPublicId();
            }
        } catch (Exception e) {
            throw new RuntimeException("Thumbnail upload failed");
        }

        Course course = new Course();
        course.setCourseTitle(dto.getCourseTitle());
        course.setVideoTitle(dto.getVideoTitle());
        course.setPublicId(publicId);
        course.setVideoLink(dto.getVideoLink());
        course.setThumbnail(thumbnailUrl);
        course.setTags(dto.getTags());

        Course saved = courseRepository.save(course);

        return modelMapper.map(saved, AdminCourseResponseDto.class);
    }

    @Override
    public AdminRegisterResponseDto registerNewAdmin(AdminRegisterRequestDto dto) {

        // 1. Check user exist karta hai ya nahi
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check already admin hai ya nahi
        if (user.getRoles().contains(RoleType.ADMIN)) {
            throw new RuntimeException("User is already an admin");
        }

        // 3. Role update karo
        user.getRoles().add(RoleType.ADMIN);
        userRepository.save(user);

        // 4. Admin profile create karo
        Admin admin = Admin.builder()
                .adminId(generateCustomId())
                .name(dto.getName())
                .email(dto.getEmail())
                .role(RoleType.ADMIN.name())
                .build();

        Admin savedAdmin = adminRepository.save(admin);

        // 5. Response prepare karo
        AdminRegisterResponseDto response = new AdminRegisterResponseDto();
        response.setId(savedAdmin.getId());
        response.setAdminId(savedAdmin.getAdminId());
        response.setName(savedAdmin.getName());
        response.setEmail(savedAdmin.getEmail());
        response.setRole(savedAdmin.getRole());

        return response;
    }

    @Override
    public List<AdminUserDetailsResponseDto> getUserDetails() {
        List<User> user=userRepository.findAll();
        return user.stream().map(user1->{
            AdminUserDetailsResponseDto dto=new AdminUserDetailsResponseDto();
            dto.setName(user1.getName());
            dto.setEmail(user1.getEmail());
            dto.setRole(user1.getRoles().toString());
            dto.setStatus(user1.getStatus().toString()!=null ? user1.getStatus().toString() : UserStatus.INACTIVE.toString());
            return dto;
        }).toList();
    }

    @Override
    public AdminProfileResponseDto updateProfile(AdminProfileRequestDto dto) {

        User user = userRepository.findByEmail(getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 🔥 TRY TO FIND ADMIN
        Admin admin = adminRepository.findByEmail(user.getEmail()).orElse(null);

        String imageUrl = null;
        String publicId = null;

        try {
            if (dto.getProfileUrl() != null && !dto.getProfileUrl().isEmpty()) {

                // 👉 If updating → delete old image
                if (admin != null && admin.getPublicId() != null) {
                    cloudinaryMediaService.deleteMedia(admin.getPublicId(), "image");
                }

                var uploadResult = cloudinaryMediaService.uploadImage(dto.getProfileUrl());
                imageUrl = uploadResult.getSecureUrl();
                publicId = uploadResult.getPublicId();
            }
        } catch (Exception e) {
            throw new RuntimeException("Image upload/update failed");
        }

        // ================= CREATE =================
        if (admin == null) {

            admin = Admin.builder()
                    .name(dto.getName())
                    .email(user.getEmail())
                    .role(RoleType.ADMIN.name())
                    .phone(dto.getPhone())
                    .profileUrl(imageUrl)
                    .publicId(publicId)
                    .location(dto.getLocation())
                    .build();

        }
        // ================= UPDATE =================
        else {

            if (dto.getName() != null) admin.setName(dto.getName());
            if (dto.getPhone() != null) admin.setPhone(dto.getPhone());
            if (dto.getLocation() != null) admin.setLocation(dto.getLocation());

            if (imageUrl != null) {
                admin.setProfileUrl(imageUrl);
                admin.setPublicId(publicId);
            }
        }

        Admin saved = adminRepository.save(admin);

        return AdminProfileResponseDto.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .phone(saved.getPhone())
                .profileUrl(saved.getProfileUrl())
                .location(saved.getLocation())
                .build();
    }

}
