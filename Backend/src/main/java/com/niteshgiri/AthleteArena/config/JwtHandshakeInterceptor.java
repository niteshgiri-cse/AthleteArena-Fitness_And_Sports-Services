package com.niteshgiri.AthleteArena.config;

import com.niteshgiri.AthleteArena.config.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.*;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final AuthUtil authUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        try {
            List<String> authHeaders = request.getHeaders().get("Authorization");

            if (authHeaders == null || authHeaders.isEmpty()) return false;

            String token = authHeaders.get(0).substring(7);
            String email = authUtil.getEmailFromToken(token);

            attributes.put("userEmail", email);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
    }
}