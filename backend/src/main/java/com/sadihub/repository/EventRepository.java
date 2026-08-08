package com.sadihub.repository;

import com.sadihub.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, String> {
    List<EventEntity> findByFamilyIdOrderByEventDateAsc(String familyId);
}
