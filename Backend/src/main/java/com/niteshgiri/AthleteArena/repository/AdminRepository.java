package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Admin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin,String> {
    Optional<Admin> findByEmail(@NotBlank(message = "Email is required") @Email(message = "Please enter a valid email") String email);
}
