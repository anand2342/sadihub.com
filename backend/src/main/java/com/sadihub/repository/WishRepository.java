package com.sadihub.repository;

import com.sadihub.entity.WishEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishRepository extends JpaRepository<WishEntity, String> {
    List<WishEntity> findByFamilyIdOrderByCreatedAtDesc(String familyId);
}
