package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface CourseRepository extends MongoRepository<Course, String> {
   Optional<Course> findByVideoId(String videoId);
}