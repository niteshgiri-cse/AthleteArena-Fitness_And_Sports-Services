package com.niteshgiri.AthleteArena.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.HashSet;
import java.util.Set;

@Document(collection = "course")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    private String id;
    private String thumbnail;
    private String publicId;
    private String courseTitle;
    @NotBlank(message = "Video Id is required field")
    @Indexed(unique = true)
    private String videoId;
    private String videoTitle;
    private String videoLink;
    private Set<String> tags=new HashSet<>();

}
