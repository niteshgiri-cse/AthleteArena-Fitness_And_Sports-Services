package com.niteshgiri.AthleteArena.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.niteshgiri.AthleteArena.service.RoomManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class SignalHandler extends TextWebSocketHandler {

    private final RoomManager roomManager;
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        Map<String, Object> data = mapper.readValue(message.getPayload(), Map.class);

        String type = (String) data.get("type");
        String room = (String) data.getOrDefault("room", "default");
        String userId = (String) data.getOrDefault("userId", session.getId());

        System.out.println("📨 Received: " + type + " from user " + userId + " in room " + room);

        // ================= JOIN =================
        if ("join".equals(type)) {
            roomManager.join(room, userId, session);
            Map<String, WebSocketSession> roomMap = roomManager.getRoom(room);
            int size = roomMap.size();

            System.out.println("👥 Room " + room + " now has " + size + " users: " + roomMap.keySet());

            if (size == 1) {
                // First user - wait
                session.sendMessage(new TextMessage("{\"type\":\"wait\"}"));
                System.out.println("📤 Sent wait to first user");
            } else if (size >= 2) {
                // ✅ FIX: Notify both users about each other
                List<String> userIds = roomMap.keySet().stream().toList();

                for (Map.Entry<String, WebSocketSession> entry : roomMap.entrySet()) {
                    String currentUser = entry.getKey();
                    WebSocketSession currentSession = entry.getValue();

                    // Find the OTHER user (not current)
                    String targetUser = userIds.stream()
                            .filter(u -> !u.equals(currentUser))
                            .findFirst()
                            .orElse(null);

                    if (targetUser != null && currentSession.isOpen()) {
                        String readyMsg = String.format(
                                "{\"type\":\"ready\",\"target\":\"%s\"}",
                                targetUser
                        );
                        currentSession.sendMessage(new TextMessage(readyMsg));
                        System.out.println("📤 Sent ready to " + currentUser + " (target: " + targetUser + ")");
                    }
                }
            }
            return;
        }

        // ================= SIGNALING =================
        if ("offer".equals(type) || "answer".equals(type) || "candidate".equals(type)) {
            String target = (String) data.get("target");
            Map<String, WebSocketSession> roomMap = roomManager.getRoom(room);

            if (roomMap == null || roomMap.isEmpty()) {
                System.out.println("❌ Room empty or null: " + room);
                return;
            }

            WebSocketSession targetSession = null;

            // Try direct target first
            if (target != null && !target.isEmpty()) {
                targetSession = roomMap.get(target);
                if (targetSession != null) {
                    System.out.println("🎯 Found target by userId: " + target);
                }
            }

            // Fallback: send to any other user in room
            if (targetSession == null) {
                String currentUserId = roomManager.getUserBySession(session.getId());
                for (Map.Entry<String, WebSocketSession> entry : roomMap.entrySet()) {
                    if (!entry.getKey().equals(currentUserId)) {
                        targetSession = entry.getValue();
                        System.out.println("🔄 Fallback: Sending to " + entry.getKey());
                        break;
                    }
                }
            }

            if (targetSession != null && targetSession.isOpen()) {
                targetSession.sendMessage(message);
                System.out.println("✅ Forwarded " + type + " to peer");
            } else {
                System.out.println("❌ No valid target for " + type + " (target: " + target + ")");
            }
        }

        // ================= CHAT =================
        if ("chat".equals(type)) {
            String text = (String) data.get("text");
            System.out.println("💬 Chat in room " + room + ": " + text);

            // Broadcast chat to all users in room except sender
            Map<String, WebSocketSession> roomMap = roomManager.getRoom(room);
            String currentUserId = roomManager.getUserBySession(session.getId());

            for (Map.Entry<String, WebSocketSession> entry : roomMap.entrySet()) {
                if (!entry.getKey().equals(currentUserId) && entry.getValue().isOpen()) {
                    entry.getValue().sendMessage(message);
                }
            }
        }

        // ================= SCREEN SHARE =================
        if ("screen-start".equals(type) || "screen-stop".equals(type)) {
            Map<String, WebSocketSession> roomMap = roomManager.getRoom(room);
            String currentUserId = roomManager.getUserBySession(session.getId());

            for (Map.Entry<String, WebSocketSession> entry : roomMap.entrySet()) {
                if (!entry.getKey().equals(currentUserId) && entry.getValue().isOpen()) {
                    entry.getValue().sendMessage(message);
                    System.out.println("📺 Forwarded " + type + " to peer");
                }
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("🔌 WebSocket connected: " + session.getId());
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String room = roomManager.getRoomBySession(session.getId());
        String user = roomManager.getUserBySession(session.getId());

        System.out.println("❌ Disconnected: " + session.getId() + " (user: " + user + ", room: " + room + ")");

        roomManager.remove(session);

        if (room != null && user != null) {
            Map<String, WebSocketSession> remaining = roomManager.getRoom(room);
            if (remaining != null && !remaining.isEmpty()) {
                for (WebSocketSession s : remaining.values()) {
                    if (s.isOpen()) {
                        String leftMsg = String.format(
                                "{\"type\":\"peer-left\",\"userId\":\"%s\"}",
                                user
                        );
                        s.sendMessage(new TextMessage(leftMsg));
                        System.out.println("📤 Sent peer-left to remaining users");
                    }
                }
            }
        }
    }
}