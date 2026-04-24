package com.niteshgiri.AthleteArena.config;

import com.niteshgiri.AthleteArena.handler.SignalHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final SignalHandler signalHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalHandler, "/ws")
                .setAllowedOriginPatterns("*");
    }
}