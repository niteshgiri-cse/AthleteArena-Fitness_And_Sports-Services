package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
}