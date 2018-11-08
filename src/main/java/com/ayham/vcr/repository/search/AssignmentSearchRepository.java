package com.ayham.vcr.repository.search;

import com.ayham.vcr.domain.Assignment;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Assignment entity.
 */
public interface AssignmentSearchRepository extends ElasticsearchRepository<Assignment, Long> {
}
