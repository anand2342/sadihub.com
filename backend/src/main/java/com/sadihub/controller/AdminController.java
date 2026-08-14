package com.sadihub.controller;

import com.sadihub.entity.UserEntity;
import com.sadihub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin")
@SuppressWarnings("null")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/members/{familyId}")
    public ResponseEntity<List<UserEntity>> getMembers(@PathVariable String familyId) {
        List<UserEntity> members = userRepository.findByFamilyId(familyId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/members/{profileId}/approve")
    public ResponseEntity<?> approveMember(@PathVariable String profileId) {
        Optional<UserEntity> userOpt = userRepository.findById(profileId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UserEntity user = userOpt.get();
        user.setStatus("approved");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Member approved successfully!", "user", user));
    }

    @PostMapping("/members/{profileId}/reject")
    public ResponseEntity<?> rejectMember(@PathVariable String profileId) {
        Optional<UserEntity> userOpt = userRepository.findById(profileId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        UserEntity user = userOpt.get();
        user.setStatus("rejected");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Member registration rejected.", "user", user));
    }
}
