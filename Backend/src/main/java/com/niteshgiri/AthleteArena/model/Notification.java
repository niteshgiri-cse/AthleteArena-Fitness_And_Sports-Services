package com.niteshgiri.AthleteArena.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "support")
public class Notification {
    @Id
    private String id;
    private String username;
    private String email;
    private String userId;
    private String content;
    private LocalDateTime localDateTime;
}
