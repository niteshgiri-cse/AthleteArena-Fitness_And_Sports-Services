package com.niteshgiri.AthleteArena.model;

import com.niteshgiri.AthleteArena.model.type.RoleType;
import com.niteshgiri.AthleteArena.model.type.UserStatus;
import jakarta.validation.constraints.*;
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
    @Size(min = 2, max = 50)
    private String name;

    @Indexed(unique = true)
    @NotBlank(message = "Username is required")
    private String username;

    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6)
    private String password;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Builder.Default
    private Set<RoleType> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .toList();
    }
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.BLOCKED;
    }
    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE;
    }

}