package com.ayham.vcr.repository.search;

import com.ayham.vcr.domain.ReadingMaterial;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the ReadingMaterial entity.
 */
public interface ReadingMaterialSearchRepository extends ElasticsearchRepository<ReadingMaterial, Long> {
}
