package com.niteshgiri.AthleteArena.entity;

import com.niteshgiri.AthleteArena.entity.type.MediaCategory;
import com.niteshgiri.AthleteArena.entity.type.MediaType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String publicId;
    private String url;
    private String secureUrl;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private MediaCategory category;

    @ElementCollection
    @Builder.Default
    @CollectionTable(name = "media_tags",joinColumns = @JoinColumn(name = "media_id"))
    @Column(name = "tag")
    private Set<String> tags=new HashSet<>();

    private String title;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;
}