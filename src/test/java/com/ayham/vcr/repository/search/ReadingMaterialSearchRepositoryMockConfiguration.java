package com.ayham.vcr.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of ReadingMaterialSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ReadingMaterialSearchRepositoryMockConfiguration {

    @MockBean
    private ReadingMaterialSearchRepository mockReadingMaterialSearchRepository;

}
