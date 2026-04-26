package com.niteshgiri.AthleteArena.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomManager {

    // roomId -> (userId -> session)
    private final Map<String, Map<String, WebSocketSession>> rooms = new ConcurrentHashMap<>();

    // sessionId -> userId
    private final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();

    // sessionId -> roomId
    private final Map<String, String> sessionRoomMap = new ConcurrentHashMap<>();

    // ================= JOIN =================
    public void join(String room, String userId, WebSocketSession session) {

        String finalUserId = (userId == null || userId.isEmpty())
                ? session.getId()
                : userId;

        // ✅ FIX: properly remove old session of same user
        sessionUserMap.entrySet().removeIf(e -> {
            if (e.getValue().equals(finalUserId)) {

                String oldSessionId = e.getKey();
                String oldRoom = sessionRoomMap.get(oldSessionId);

                if (oldRoom != null) {
                    Map<String, WebSocketSession> roomMap = rooms.get(oldRoom);
                    if (roomMap != null) {
                        roomMap.remove(finalUserId);

                        // remove room if empty
                        if (roomMap.isEmpty()) {
                            rooms.remove(oldRoom);
                        }
                    }
                }

                sessionRoomMap.remove(oldSessionId);
                return true;
            }
            return false;
        });

        // ✅ add user to room
        rooms.computeIfAbsent(room, k -> new ConcurrentHashMap<>())
                .put(finalUserId, session);

        sessionUserMap.put(session.getId(), finalUserId);
        sessionRoomMap.put(session.getId(), room);

        System.out.println("JOIN -> room=" + room + " user=" + finalUserId);
        System.out.println("ROOM USERS: " + rooms.get(room).keySet());
    }

    // ================= REMOVE =================
    public void remove(WebSocketSession session) {

        String sessionId = session.getId();

        String userId = sessionUserMap.remove(sessionId);
        String room = sessionRoomMap.remove(sessionId);

        if (userId == null || room == null) return;

        Map<String, WebSocketSession> roomMap = rooms.get(room);

        if (roomMap != null) {
            roomMap.remove(userId);

            if (roomMap.isEmpty()) {
                rooms.remove(room);
            }
        }

        System.out.println("REMOVE -> room=" + room + " user=" + userId);
    }

    // ================= GETTERS =================
    public Map<String, WebSocketSession> getRoom(String room) {
        return rooms.getOrDefault(room, Collections.emptyMap());
    }

    public Map<String, Map<String, WebSocketSession>> getAllRooms() {
        return rooms;
    }

    public String getRoomBySession(String sessionId) {
        return sessionRoomMap.get(sessionId);
    }

    public String getUserBySession(String sessionId) {
        return sessionUserMap.get(sessionId);
    }
}