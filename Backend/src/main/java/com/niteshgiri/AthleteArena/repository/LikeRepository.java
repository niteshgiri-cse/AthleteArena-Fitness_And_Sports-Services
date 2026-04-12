package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepository extends MongoRepository<Like, String> {
    int countByPostId(String postId);
}