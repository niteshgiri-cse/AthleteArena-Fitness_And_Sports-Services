package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
    int countByPostId(String postId);
}