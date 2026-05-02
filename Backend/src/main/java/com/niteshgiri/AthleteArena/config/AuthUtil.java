package com.niteshgiri.AthleteArena.config;

import com.niteshgiri.AthleteArena.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
@Component
public class AuthUtil {


    @Value("${jwt.secretKey}")
    private String secretKey;

    private SecretKey getSecretkey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user){
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId",user.getId().toString())
                .claim("roles",user.getRoles().toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+1000*60*60))
                .signWith(getSecretkey())
                .compact();
    }

    public String getEmailFromToken(String token){
        Claims claims=Jwts.parser()
                .verifyWith(getSecretkey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getCurrentUserEmail(){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    public String getLoggedInUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user.getId();
    }

}