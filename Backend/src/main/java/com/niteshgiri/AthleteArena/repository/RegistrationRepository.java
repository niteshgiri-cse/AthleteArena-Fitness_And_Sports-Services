package com.niteshgiri.AthleteArena.repository;

import com.niteshgiri.AthleteArena.model.Registration;
import com.niteshgiri.AthleteArena.model.type.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration,String> {
    boolean existsByUserIdAndEventId(String userId, String eventId);

    Optional<Registration> findByRazorpayOrderId(String orderId);

    List<Registration> findByUserId(String userId);

    long countByEventIdAndStatus(String eventId, BookingStatus bookingStatus);

    boolean existsByUserIdAndEventIdAndStatus(String userId, String eventId, BookingStatus bookingStatus);
}
