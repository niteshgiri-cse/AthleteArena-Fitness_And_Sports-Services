package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    int countByPostId(String postId);
}