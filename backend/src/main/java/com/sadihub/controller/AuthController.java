package com.sadihub.controller;

import com.sadihub.config.JwtUtils;
import com.sadihub.entity.FamilyEntity;
import com.sadihub.entity.UserEntity;
import com.sadihub.repository.FamilyRepository;
import com.sadihub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@SuppressWarnings("null")
public class AuthController {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository,
                          FamilyRepository familyRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.familyRepository = familyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password required"));
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(email.toLowerCase().trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        UserEntity user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword()) && !password.equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        Optional<FamilyEntity> familyOpt = familyRepository.findById(user.getFamilyId());
        FamilyEntity family = familyOpt.orElseGet(() -> new FamilyEntity(user.getFamilyId(), "Family Wedding", "family", "WEDDING123"));

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getFamilyId(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user_id", user.getId());
        response.put("email", user.getEmail());
        response.put("roles", user.getRole() != null ? Collections.singletonList(user.getRole()) : Collections.emptyList());
        response.put("profile", user);
        response.put("current_family", family);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinFamily(@RequestBody Map<String, String> payload) {
        String familyCode = payload.get("familyCode");
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        String password = payload.get("password");
        String relation = payload.getOrDefault("relation", "Cousin");
        String mobileNumber = payload.getOrDefault("mobileNumber", "");

        if (familyCode == null || fullName == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "All required fields must be provided"));
        }

        Optional<FamilyEntity> familyOpt = familyRepository.findByFamilyCode(familyCode.trim().toUpperCase());
        if (familyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Family Code! Please check with your Family Admin."));
        }

        FamilyEntity family = familyOpt.get();

        if (userRepository.findByEmail(email.toLowerCase().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists!"));
        }

        String userId = "user-" + UUID.randomUUID();
        UserEntity user = new UserEntity();
        user.setId(userId);
        user.setFamilyId(family.getId());
        user.setFullName(fullName.trim());
        user.setEmail(email.toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(password));
        user.setRelation(relation);
        user.setMobileNumber(mobileNumber);
        user.setStatus("pending"); // Strictly PENDING until Family Admin approves
        user.setRole("family_member");
        user.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + UUID.randomUUID());

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getFamilyId(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user_id", user.getId());
        response.put("email", user.getEmail());
        response.put("roles", user.getRole() != null ? Collections.singletonList(user.getRole()) : Collections.emptyList());
        response.put("profile", user);
        response.put("current_family", family);

        return ResponseEntity.ok(response);
    }
}
