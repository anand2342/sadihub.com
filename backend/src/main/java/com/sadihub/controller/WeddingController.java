package com.sadihub.controller;

import com.sadihub.entity.WeddingEntity;
import com.sadihub.repository.WeddingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wedding")
@SuppressWarnings("null")
public class WeddingController {

    private final WeddingRepository weddingRepository;

    public WeddingController(WeddingRepository weddingRepository) {
        this.weddingRepository = weddingRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<WeddingEntity> getWedding(@PathVariable String familyId) {
        Optional<WeddingEntity> wedding = weddingRepository.findByFamilyId(familyId);
        if (wedding.isPresent()) {
            return ResponseEntity.ok(wedding.get());
        }
        
        // Return default wedding template
        WeddingEntity defaultWedding = new WeddingEntity();
        defaultWedding.setId("wedding-default");
        defaultWedding.setFamilyId(familyId);
        defaultWedding.setGroomName("Anurag Nayak");
        defaultWedding.setBrideName("Shalu Kumari");
        defaultWedding.setGroomFather("Rajesh Nayak");
        defaultWedding.setGroomMother("Sunita Nayak");
        defaultWedding.setBrideFather("Suresh Kumar");
        defaultWedding.setBrideMother("Meena Kumari");
        defaultWedding.setWeddingDate("2026-08-25T10:00:00.000Z");
        defaultWedding.setVenueName("Grand Wedding Venue");
        defaultWedding.setVenueAddress("Main Boulevard, City");
        return ResponseEntity.ok(defaultWedding);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<WeddingEntity> updateWedding(@PathVariable String familyId, @RequestBody WeddingEntity updates) {
        Optional<WeddingEntity> existingOpt = weddingRepository.findByFamilyId(familyId);
        WeddingEntity wedding = existingOpt.orElseGet(WeddingEntity::new);

        if (wedding.getId() == null) {
            wedding.setId("wedding-" + UUID.randomUUID());
            wedding.setFamilyId(familyId);
        }

        if (updates.getGroomName() != null) wedding.setGroomName(updates.getGroomName());
        if (updates.getGroomFather() != null) wedding.setGroomFather(updates.getGroomFather());
        if (updates.getGroomMother() != null) wedding.setGroomMother(updates.getGroomMother());
        if (updates.getGroomBio() != null) wedding.setGroomBio(updates.getGroomBio());
        if (updates.getGroomImage() != null) wedding.setGroomImage(updates.getGroomImage());

        if (updates.getBrideName() != null) wedding.setBrideName(updates.getBrideName());
        if (updates.getBrideFather() != null) wedding.setBrideFather(updates.getBrideFather());
        if (updates.getBrideMother() != null) wedding.setBrideMother(updates.getBrideMother());
        if (updates.getBrideBio() != null) wedding.setBrideBio(updates.getBrideBio());
        if (updates.getBrideImage() != null) wedding.setBrideImage(updates.getBrideImage());

        if (updates.getWeddingDate() != null) wedding.setWeddingDate(updates.getWeddingDate());
        if (updates.getVenueName() != null) wedding.setVenueName(updates.getVenueName());
        if (updates.getVenueAddress() != null) wedding.setVenueAddress(updates.getVenueAddress());
        if (updates.getGoogleMapsLink() != null) wedding.setGoogleMapsLink(updates.getGoogleMapsLink());
        if (updates.getLoveStory() != null) wedding.setLoveStory(updates.getLoveStory());

        WeddingEntity saved = weddingRepository.save(wedding);
        return ResponseEntity.ok(saved);
    }
}
