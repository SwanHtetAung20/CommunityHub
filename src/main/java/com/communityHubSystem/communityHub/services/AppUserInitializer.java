package com.communityHubSystem.communityHub.services;

import com.communityHubSystem.communityHub.models.User;
import com.communityHubSystem.communityHub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserInitializer {

    private final UserRepository userRepository;


    private final PasswordEncoder passwordEncoder;

    @Transactional
    @EventListener(classes = ContextRefreshedEvent.class)
    public void initializeAppUser(){
        if(userRepository.count() == 0){
            var user = new User();
            user.setId(1L);
            user.setEmail("admin@gmail.com");
            user.setActive(true);
            user.setRole(User.Role.ADMIN);
            user.setPassword(passwordEncoder.encode("admin"));
            user.setPhone(List.of("09978564121"));
            user.setStaffId("99-00001");
            userRepository.save(user);
        }
    }
}
