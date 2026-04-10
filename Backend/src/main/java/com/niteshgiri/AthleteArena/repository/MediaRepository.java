package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.MediaPost;
import com.niteshgiri.AthleteArena.model.type.MediaType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepository extends MongoRepository<MediaPost, String> {

    List<MediaPost> findByUserId(String userId);

    List<MediaPost> findByUserIdAndMediaType(String userId, MediaType mediaType);

    List<MediaPost> findAllByOrderByCreatedAtDesc();
}