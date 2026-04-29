package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.dto.response.EventResponseDto;
import com.niteshgiri.AthleteArena.service.Interface.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    @GetMapping
    public ResponseEntity<List<EventResponseDto>> getAllEvents(){
       List<EventResponseDto> res=eventService.getAllEvents();
        return ResponseEntity.ok(res);
    }

}
