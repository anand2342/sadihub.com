package com.sadihub.controller;

import com.sadihub.entity.PhotoEntity;
import com.sadihub.repository.PhotoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/photos")
public class PhotoController {

    private final PhotoRepository photoRepository;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<?> getPhotos(@PathVariable String familyId) {
        List<PhotoEntity> photos = photoRepository.findByFamilyIdOrderByCreatedAtDesc(familyId);
        return ResponseEntity.ok(photos);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<?> addPhoto(@PathVariable String familyId, @RequestBody PhotoEntity photo) {
        // Enforce 10 photos max per user handle in Java logic
        long currentCount = photoRepository.countByFamilyIdAndUserId(familyId, photo.getUserId());
        if (currentCount >= 10) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Upload limit reached! Each member can upload a maximum of 10 photos."
            ));
        }

        if (photo.getId() == null || photo.getId().isEmpty()) {
            photo.setId("photo-" + UUID.randomUUID().toString());
        }
        photo.setFamilyId(familyId);
        PhotoEntity saved = photoRepository.save(photo);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{photoId}/like")
    public ResponseEntity<?> likePhoto(@PathVariable String photoId) {
        return photoRepository.findById(photoId).map(photo -> {
            photo.setLikesCount((photo.getLikesCount() == null ? 0 : photo.getLikesCount()) + 1);
            photoRepository.save(photo);
            return ResponseEntity.ok(photo);
        }).orElse(ResponseEntity.notFound().build());
    }
}
