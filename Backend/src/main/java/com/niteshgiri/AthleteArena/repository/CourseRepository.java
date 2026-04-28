package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
}