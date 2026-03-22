package com.teachei.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableCaching
@EnableJpaAuditing
public class TeAcheiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeAcheiApplication.class, args);
    }
    //
}
