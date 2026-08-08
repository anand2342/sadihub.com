package com.sadihub.repository;

import com.sadihub.entity.FamilyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyRepository extends JpaRepository<FamilyEntity, String> {
    Optional<FamilyEntity> findByFamilyCode(String familyCode);
    Optional<FamilyEntity> findBySlug(String slug);
}
