package com.sadihub.repository;

import com.sadihub.entity.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<PhotoEntity, String> {
    List<PhotoEntity> findByFamilyIdOrderByCreatedAtDesc(String familyId);
    long countByFamilyIdAndUserId(String familyId, String userId);
}
