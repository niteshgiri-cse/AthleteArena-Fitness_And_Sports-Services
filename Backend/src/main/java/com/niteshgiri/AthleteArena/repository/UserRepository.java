package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository  extends JpaRepository<User,Long> {


    Optional<User> findByEmail(@Email @NotBlank(message = "Email is required") String email);
}
