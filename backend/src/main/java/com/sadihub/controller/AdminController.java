package com.sadihub.controller;

import com.sadihub.entity.UserEntity;
import com.sadihub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/members/{familyId}")
    public ResponseEntity<?> getMembers(@PathVariable String familyId) {
        List<UserEntity> members = userRepository.findByFamilyId(familyId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/members/{profileId}/approve")
    public ResponseEntity<?> approveMember(@PathVariable String profileId) {
        return userRepository.findById(profileId).map(user -> {
            user.setStatus("approved");
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Member approved successfully!", "user", user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/members/{profileId}/reject")
    public ResponseEntity<?> rejectMember(@PathVariable String profileId) {
        return userRepository.findById(profileId).map(user -> {
            user.setStatus("rejected");
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Member registration rejected.", "user", user));
        }).orElse(ResponseEntity.notFound().build());
    }
}
