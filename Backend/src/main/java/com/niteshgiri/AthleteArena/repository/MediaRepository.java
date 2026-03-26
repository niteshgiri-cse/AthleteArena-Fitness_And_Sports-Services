package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.entity.Media;
import com.niteshgiri.AthleteArena.entity.type.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media,String>{

    List<Media> findByUser_Id(Long userId);

    List<Media> findByUser_IdAndMediaType(Long userId,MediaType mediaType);

    @Query("SELECT m FROM Media m JOIN FETCH m.user ORDER BY m.createdAt DESC")
    List<Media> getFeed();
}