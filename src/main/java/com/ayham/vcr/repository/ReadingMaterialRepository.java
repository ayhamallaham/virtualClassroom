package com.ayham.vcr.repository;

import com.ayham.vcr.domain.ReadingMaterial;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ReadingMaterial entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReadingMaterialRepository extends JpaRepository<ReadingMaterial, Long> {

}
