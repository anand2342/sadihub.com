package com.sadihub.controller;

import com.sadihub.entity.WishEntity;
import com.sadihub.repository.WishRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wishes")
public class WishController {

    private final WishRepository wishRepository;

    public WishController(WishRepository wishRepository) {
        this.wishRepository = wishRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<?> getWishes(@PathVariable String familyId) {
        List<WishEntity> wishes = wishRepository.findByFamilyIdOrderByCreatedAtDesc(familyId);
        return ResponseEntity.ok(wishes);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<?> addWish(@PathVariable String familyId, @RequestBody WishEntity wish) {
        if (wish.getId() == null || wish.getId().isEmpty()) {
            wish.setId("wish-" + UUID.randomUUID().toString());
        }
        wish.setFamilyId(familyId);
        WishEntity saved = wishRepository.save(wish);
        return ResponseEntity.ok(saved);
    }
}
