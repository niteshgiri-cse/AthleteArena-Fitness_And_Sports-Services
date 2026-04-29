package com.niteshgiri.AthleteArena.service.Interface;


import com.niteshgiri.AthleteArena.dto.response.EventResponseDto;

import java.util.List;

public interface EventService {

    List<EventResponseDto> getAllEvents();
}
