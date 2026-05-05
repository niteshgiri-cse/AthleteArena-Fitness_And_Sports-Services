        package com.niteshgiri.AthleteArena.dto.response;

        import lombok.*;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public class LoginResponseDto {
            private String id;
            private String jwt;
        }