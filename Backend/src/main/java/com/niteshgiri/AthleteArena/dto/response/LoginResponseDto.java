package com.niteshgiri.AthleteArena.dto.response;

import com.niteshgiri.AthleteArena.model.type.RoleType;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String id;
    private String jwt;
    private Set<RoleType> roles;
}