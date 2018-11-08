package com.ayham.vcr.repository;

import com.ayham.vcr.domain.StudyGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the StudyGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

}
