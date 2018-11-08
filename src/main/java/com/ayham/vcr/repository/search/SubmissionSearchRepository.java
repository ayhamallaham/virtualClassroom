package com.ayham.vcr.repository.search;

import com.ayham.vcr.domain.Submission;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Submission entity.
 */
public interface SubmissionSearchRepository extends ElasticsearchRepository<Submission, Long> {
}
