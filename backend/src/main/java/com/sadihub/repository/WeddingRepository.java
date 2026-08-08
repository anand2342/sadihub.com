package com.sadihub.repository;

import com.sadihub.entity.WeddingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeddingRepository extends JpaRepository<WeddingEntity, String> {
    Optional<WeddingEntity> findByFamilyId(String familyId);
}
