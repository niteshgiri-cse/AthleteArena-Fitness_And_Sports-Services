package com.niteshgiri.AthleteArena.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "admin_profile")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Admin {
    @Id
    private String id;
    private String adminId;
    private String name;
    private String role;
    private String email;
    private String phone;
    private String profileUrl;
    private String publicId;
    private String location;
    private String totalUser;
    private String events;

}
