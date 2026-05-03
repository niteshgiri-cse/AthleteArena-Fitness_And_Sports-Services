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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
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
    private final PasswordEncoder passwordEncoder;
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
    @Transactional
    public EventResponseDto createEvent(AdminEventRequestDto dto) {

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

        return modelMapper.map(saved, EventResponseDto.class);
    }

    @Override
    @Transactional
    public CourseResponseDto createCourse(AdminCourseRequestDto dto) {

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
        course.setVideoId(dto.getVideoId());
        course.setVideoLink(dto.getVideoLink());
        course.setThumbnail(thumbnailUrl);
        course.setTags(dto.getTags());

        Course saved = courseRepository.save(course);

        return modelMapper.map(saved, CourseResponseDto.class);
    }

    @Override
    @Transactional
    public AdminRegisterResponseDto registerNewAdmin(AdminRegisterRequestDto dto) {

        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (user == null) {
            user = new User();
            user.setName(dto.getName().trim());
            user.setEmail(dto.getEmail().trim().toLowerCase());

            String cleanName = dto.getName()
                    .trim()
                    .replaceAll("\\s+", "");

            String username = cleanName + "_" +
                    UUID.randomUUID().toString().substring(0, 6).toUpperCase();

            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setStatus(UserStatus.ACTIVE);
            user.setRoles(new HashSet<>());
        }

        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }

        if (user.getRoles().contains(RoleType.ADMIN)) {
            throw new RuntimeException("User is already an admin");
        }

        user.getRoles().add(RoleType.ADMIN);
        user.getRoles().add(RoleType.USER);

        userRepository.save(user);

        Optional<Admin> existingAdmin = adminRepository.findByEmail(dto.getEmail());
        if (existingAdmin.isPresent()) {
            throw new RuntimeException("Admin already exists");
        }

        Admin admin = Admin.builder()
                .adminId(generateCustomId())
                .name(dto.getName())
                .email(dto.getEmail())
                .role(RoleType.ADMIN.name())
                .build();

        Admin savedAdmin = adminRepository.save(admin);

        return AdminRegisterResponseDto.builder()
                .id(savedAdmin.getId())
                .adminId(savedAdmin.getAdminId())
                .name(savedAdmin.getName())
                .email(savedAdmin.getEmail())
                .role(savedAdmin.getRole())
                .build();
    }

    @Override
    public List<AdminUserDetailsResponseDto> getUserDetails() {

        return userRepository.findAll()
                .stream()
                .map(user -> {
                    AdminUserDetailsResponseDto dto = new AdminUserDetailsResponseDto();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());

                    dto.setRole(
                            user.getRoles() != null && !user.getRoles().isEmpty()
                                    ? user.getRoles().stream()
                                    .map(Enum::name)
                                    .findFirst()
                                    .orElse("USER")
                                    : "USER"
                    );
                    dto.setStatus(
                            user.getStatus() != null
                                    ? user.getStatus().name()
                                    : UserStatus.ACTIVE.name()
                    );

                    return dto;
                })
                .toList();
    }

    @Override
    public AdminProfileResponseDto updateProfile(AdminProfileRequestDto dto) {

        User user = userRepository.findByEmail(getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

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
    @Override
    @Transactional
    public void deleteCourse(String videoId) throws IOException {

        Course course = courseRepository.findByVideoId(videoId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 🔥 DELETE IMAGE FROM CLOUDINARY FIRST
        if (course.getPublicId() != null) {
            cloudinaryMediaService.deleteMedia(course.getPublicId(), "image");
        }

        // 🔥 DELETE FROM DB
        courseRepository.delete(course);
    }
    @Override
    @Transactional
    public CourseResponseDto updateCourse(String videoId, AdminCourseRequestDto dto) {

        Course course = courseRepository.findByVideoId(videoId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String thumbnailUrl = course.getThumbnail();
        String publicId = course.getPublicId();

        try {

            if (dto.getThumbnail() != null && !dto.getThumbnail().isEmpty()) {

                if (publicId != null) {
                    cloudinaryMediaService.deleteMedia(publicId, "image");
                }

                var upload = cloudinaryMediaService.uploadImage(dto.getThumbnail());
                thumbnailUrl = upload.getSecureUrl();
                publicId = upload.getPublicId();
            }
        } catch (Exception e) {
            throw new RuntimeException("Thumbnail update failed");
        }
        if (dto.getCourseTitle() != null) course.setCourseTitle(dto.getCourseTitle());
        if (dto.getVideoTitle() != null) course.setVideoTitle(dto.getVideoTitle());
        if (dto.getVideoLink() != null) course.setVideoLink(dto.getVideoLink());
        if (dto.getTags() != null) course.setTags(dto.getTags());

        course.setThumbnail(thumbnailUrl);
        course.setPublicId(publicId);

        Course updated = courseRepository.save(course);

        return modelMapper.map(updated, CourseResponseDto.class);
    }
    @Override
    @Transactional
    public void deleteEvent(String eventId) throws IOException {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // 🔥 DELETE IMAGE FROM CLOUDINARY
        if (event.getPublicId() != null) {
            cloudinaryMediaService.deleteMedia(event.getPublicId(), "image");
        }

        eventRepository.delete(event);
    }
    @Override
    @Transactional
    public EventResponseDto updateEvent(String eventId, AdminEventRequestDto dto) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String imageUrl = event.getImageUrl();
        String publicId = event.getPublicId();

        try {
            if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {

                if (publicId != null) {
                    cloudinaryMediaService.deleteMedia(publicId, "image");
                }

                var upload = cloudinaryMediaService.uploadImage(dto.getImageUrl());
                imageUrl = upload.getSecureUrl();
                publicId = upload.getPublicId();
            }
        } catch (Exception e) {
            throw new RuntimeException("Event image update failed");
        }

        // UPDATE FIELDS
        if (dto.getTitle() != null) event.setTitle(dto.getTitle());
        if (dto.getDataAndTime() != null) event.setDataAndTime(dto.getDataAndTime());
        if (dto.getLocation() != null) event.setLocation(dto.getLocation());
        if (dto.getStatus() != null) event.setStatus(dto.getStatus());
        if (dto.getRegistrationFees() != 0) event.setRegistrationFees(dto.getRegistrationFees());
        if (dto.getCapacity() != 0) event.setCapacity(dto.getCapacity());

        event.setImageUrl(imageUrl);
        event.setPublicId(publicId);

        Event updated = eventRepository.save(event);

        return modelMapper.map(updated, EventResponseDto.class);
    }
}
