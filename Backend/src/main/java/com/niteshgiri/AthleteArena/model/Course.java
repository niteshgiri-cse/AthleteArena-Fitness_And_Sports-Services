package com.niteshgiri.AthleteArena.model;

import lombok.*;
import org.springframework.data.annotation.Id;
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
    private String videoTitle;
    private String videoLink;
    private Set<String> tags=new HashSet<>();

}
