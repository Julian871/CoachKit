package com.coachkit.auth.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Component
public class CookieUtil {

    private final String refreshCookieName;
    private final boolean cookieHttpOnly;
    private final boolean cookieSecure;
    private final String cookiePath;
    private final int cookieMaxAgeDays;

    public CookieUtil(
            @Value("${coachkit.auth.cookie.refresh-name:refresh_token}") String refreshCookieName,
            @Value("${coachkit.auth.cookie.http-only:true}") boolean cookieHttpOnly,
            @Value("${coachkit.auth.cookie.secure:false}") boolean cookieSecure,
            @Value("${coachkit.auth.cookie.path:/api/v1/auth}") String cookiePath,
            @Value("${coachkit.auth.cookie.max-age-days:7}") int cookieMaxAgeDays) {
        this.refreshCookieName = refreshCookieName;
        this.cookieHttpOnly = cookieHttpOnly;
        this.cookieSecure = cookieSecure;
        this.cookiePath = cookiePath;
        this.cookieMaxAgeDays = cookieMaxAgeDays;
        log.debug("CookieUtil initialized with name: {}, secure: {}", refreshCookieName, cookieSecure);
    }

    /**
     * Sets refresh token as HttpOnly cookie
     */
    public void setRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(refreshCookieName, token);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);
        cookie.setPath(cookiePath);
        cookie.setMaxAge(cookieMaxAgeDays * 24 * 60 * 60);
        // Add SameSite attribute for modern browsers
        cookie.setAttribute("SameSite", "Strict");

        response.addCookie(cookie);
        log.debug("Set refresh cookie for path: {}", cookiePath);
    }

    /**
     * Clears refresh token cookie (for logout)
     */
    public void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(refreshCookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath(cookiePath);
        cookie.setMaxAge(0);

        response.addCookie(cookie);
        log.debug("Cleared refresh cookie");
    }

    /**
     * Extracts refresh token from request cookies
     * @return Optional with token if present, empty otherwise
     */
    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        return Arrays.stream(cookies)
                .filter(cookie -> refreshCookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}