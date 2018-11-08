package com.ayham.vcr.repository.search;

import com.ayham.vcr.domain.StudyGroup;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the StudyGroup entity.
 */
public interface StudyGroupSearchRepository extends ElasticsearchRepository<StudyGroup, Long> {
}
