package com.niteshgiri.AthleteArena.service.imp;

import com.niteshgiri.AthleteArena.dto.response.EventResponseDto;
import com.niteshgiri.AthleteArena.model.Event;
import com.niteshgiri.AthleteArena.repository.EventRepository;
import com.niteshgiri.AthleteArena.service.Interface.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImp implements EventService {
    private final EventRepository eventRepository;
    @Override
    public List<EventResponseDto> getAllEvents() {
        List<Event> events=eventRepository.findAll();
      return  events.stream().map(x-> EventResponseDto.builder()
              .id(x.getId())
              .title(x.getTitle())
              .capacity(x.getCapacity())
              .status(x.getStatus())
              .dataAndTime(x.getDataAndTime())
              .location(x.getLocation())
              .imageUrl(x.getImageUrl())
              .registrationFees(x.getRegistrationFees())
              .build()).toList();
    }
}
