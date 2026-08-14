package com.sadihub.controller;

import com.sadihub.entity.PhotoEntity;
import com.sadihub.repository.PhotoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/photos")
@SuppressWarnings("null")
public class PhotoController {

    private final PhotoRepository photoRepository;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<List<PhotoEntity>> getPhotos(@PathVariable String familyId) {
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

        if (photo.getUserId() == null || photo.getUserId().isEmpty()) {
            photo.setUserId("user-admin-1");
        }
        if (photo.getLikesCount() == null) {
            photo.setLikesCount(0);
        }
        if (photo.getCreatedAt() == null) {
            photo.setCreatedAt(java.time.LocalDateTime.now());
        }
        if (photo.getId() == null || photo.getId().isEmpty()) {
            photo.setId("photo-" + UUID.randomUUID());
        }
        photo.setFamilyId(familyId);
        PhotoEntity saved = photoRepository.save(photo);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{photoId}/like")
    public ResponseEntity<PhotoEntity> likePhoto(@PathVariable String photoId) {
        Optional<PhotoEntity> photoOpt = photoRepository.findById(photoId);
        if (photoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        PhotoEntity photo = photoOpt.get();
        photo.setLikesCount((photo.getLikesCount() == null ? 0 : photo.getLikesCount()) + 1);
        photoRepository.save(photo);
        return ResponseEntity.ok(photo);
    }
}
