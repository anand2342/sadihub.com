package com.sadihub.controller;

import com.sadihub.entity.EventEntity;
import com.sadihub.repository.EventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@SuppressWarnings("null")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @GetMapping("/{familyId}")
    public ResponseEntity<List<EventEntity>> getEvents(@PathVariable String familyId) {
        List<EventEntity> events = eventRepository.findByFamilyIdOrderByEventDateAsc(familyId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/{familyId}")
    public ResponseEntity<EventEntity> createEvent(@PathVariable String familyId, @RequestBody EventEntity event) {
        if (event.getId() == null || event.getId().isEmpty()) {
            event.setId("event-" + UUID.randomUUID());
        }
        event.setFamilyId(familyId);
        EventEntity saved = eventRepository.save(event);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String eventId) {
        eventRepository.deleteById(eventId);
        return ResponseEntity.ok().build();
    }
}
