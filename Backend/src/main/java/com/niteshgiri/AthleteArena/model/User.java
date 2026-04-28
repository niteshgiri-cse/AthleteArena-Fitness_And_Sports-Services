package com.niteshgiri.AthleteArena.model;

import com.niteshgiri.AthleteArena.model.type.RoleType;
import com.niteshgiri.AthleteArena.model.type.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name should be between 2 to 50 characters")
    private String name;
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    @Indexed(unique = true)
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    private UserStatus status;
    @Builder.Default
    private Set<RoleType> roles = new HashSet<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }
}