    package com.niteshgiri.AthleteArena.dto.response;

    import lombok.*;

    import java.util.Set;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class CourseResponseDto {
        private String id;
        private String thumbnail;
        private String courseTitle;
        private String videoTitle;
        private String videoId;
        private String videoLink;
        private Set<String> tags;
    }
