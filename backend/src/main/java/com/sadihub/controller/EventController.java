package com.sadihub.controller;

import com.sadihub.entity.EventEntity;
import com.sadihub.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<?> getEvents(@PathVariable String familyId) {
        List<EventEntity> events = eventRepository.findByFamilyIdOrderByEventDateAsc(familyId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<?> createEvent(@PathVariable String familyId, @RequestBody EventEntity event) {
        if (event.getId() == null || event.getId().isEmpty()) {
            event.setId("event-" + UUID.randomUUID().toString());
        }
        event.setFamilyId(familyId);
        EventEntity saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable String eventId) {
        eventRepository.deleteById(eventId);
        return ResponseEntity.ok().build();
    }
}
