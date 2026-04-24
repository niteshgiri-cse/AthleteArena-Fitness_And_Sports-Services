package com.niteshgiri.AthleteArena.controller;

import com.niteshgiri.AthleteArena.service.RoomManager;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;

@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveController {

    private final RoomManager roomManager;

    @GetMapping
    public List<Map<String, Object>> getLiveRooms() {

        List<Map<String, Object>> liveRooms = new ArrayList<>();

        // Static demo data for testing (remove in production)
        if (roomManager.getAllRooms().isEmpty()) {
            Map<String, Object> demo = new HashMap<>();
            demo.put("roomId", "demo123");
            demo.put("viewers", 5);
            demo.put("title", "Live Football Training");
            demo.put("host", "Coach John");
            demo.put("image", "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800");
            liveRooms.add(demo);
        }

        // Active rooms from RoomManager
        roomManager.getAllRooms().entrySet().stream()
                .filter(entry -> entry.getValue().size() > 0)
                .forEach(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("roomId", entry.getKey());
                    map.put("viewers", entry.getValue().size());
                    map.put("title", "Live Training Session");
                    map.put("host", "Athlete " + entry.getKey().substring(0, Math.min(4, entry.getKey().length())));
                    map.put("image", "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800");
                    liveRooms.add(map);
                });

        System.out.println("📺 Live rooms API called, returning: " + liveRooms.size() + " rooms");
        return liveRooms;
    }

    @GetMapping("/{roomId}")
    public Map<String, Object> getRoomInfo(@PathVariable String roomId) {
        Map<String, WebSocketSession> room = roomManager.getRoom(roomId);
        Map<String, Object> info = new HashMap<>();
        info.put("roomId", roomId);
        info.put("active", !room.isEmpty());
        info.put("participants", room.size());
        info.put("participantIds", room.keySet());
        return info;
    }
}