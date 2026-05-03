package com.niteshgiri.AthleteArena.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8)
    @NotBlank
    private String password;
}