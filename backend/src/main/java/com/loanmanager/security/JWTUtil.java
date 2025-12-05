package com.loanmanager.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    @Value("${app.jwt.secret:}")
    private String jwtSecret;

    public DecodedJWT validateToken(String token) {
        try {
            if (jwtSecret == null || jwtSecret.isEmpty()) {
                throw new RuntimeException("JWT secret not configured");
            }
            
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            return JWT.require(algorithm)
                    .build()
                    .verify(token);
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Token validation failed: " + e.getMessage());
        }
    }

    public String extractUserId(DecodedJWT decodedJWT) {
        return decodedJWT.getSubject();
    }
}
