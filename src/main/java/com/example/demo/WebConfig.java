package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOriginPatterns(
                        "https://query-flow-ai-uq5t.vercel.app", 
                        "http://localhost:3000", 
                        "https://*.vercel.app"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    // If you use true below, you MUST define allowedHeaders explicitly
                    .allowedHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept") 
                    .allowCredentials(true)
                    .maxAge(3600);
            }
        };
    }
}