package com.sadihub.controller;

import com.sadihub.entity.WishEntity;
import com.sadihub.repository.WishRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishes")
@SuppressWarnings("null")
public class WishController {

    private final WishRepository wishRepository;

    public WishController(WishRepository wishRepository) {
        this.wishRepository = wishRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<List<WishEntity>> getWishes(@PathVariable String familyId) {
        List<WishEntity> wishes = wishRepository.findByFamilyIdOrderByCreatedAtDesc(familyId);
        return ResponseEntity.ok(wishes);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<WishEntity> addWish(@PathVariable String familyId, @RequestBody WishEntity wish) {
        if (wish.getId() == null || wish.getId().isEmpty()) {
            wish.setId("wish-" + UUID.randomUUID());
        }
        if (wish.getUserId() == null || wish.getUserId().isEmpty()) {
            wish.setUserId("user-guest");
        }
        if (wish.getCreatedAt() == null) {
            wish.setCreatedAt(java.time.LocalDateTime.now());
        }
        wish.setFamilyId(familyId);
        WishEntity saved = wishRepository.save(wish);
        return ResponseEntity.ok(saved);
    }
}
