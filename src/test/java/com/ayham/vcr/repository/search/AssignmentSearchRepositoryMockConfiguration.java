package com.ayham.vcr.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of AssignmentSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class AssignmentSearchRepositoryMockConfiguration {

    @MockBean
    private AssignmentSearchRepository mockAssignmentSearchRepository;

}
