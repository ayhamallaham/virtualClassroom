package com.ayham.vcr.web.rest;

import com.ayham.vcr.VirtualClassroomApp;

import com.ayham.vcr.domain.Submission;
import com.ayham.vcr.repository.SubmissionRepository;
import com.ayham.vcr.repository.search.SubmissionSearchRepository;
import com.ayham.vcr.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.ayham.vcr.web.rest.TestUtil.sameInstant;
import static com.ayham.vcr.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SubmissionResource REST controller.
 *
 * @see SubmissionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = VirtualClassroomApp.class)
public class SubmissionResourceIntTest {

    private static final String DEFAULT_FILE_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_FILE_LOCATION = "BBBBBBBBBB";

    private static final Double DEFAULT_GRADE = 1D;
    private static final Double UPDATED_GRADE = 2D;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private SubmissionRepository submissionRepository;

    /**
     * This repository is mocked in the com.ayham.vcr.repository.search test package.
     *
     * @see com.ayham.vcr.repository.search.SubmissionSearchRepositoryMockConfiguration
     */
    @Autowired
    private SubmissionSearchRepository mockSubmissionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSubmissionMockMvc;

    private Submission submission;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SubmissionResource submissionResource = new SubmissionResource(submissionRepository, mockSubmissionSearchRepository);
        this.restSubmissionMockMvc = MockMvcBuilders.standaloneSetup(submissionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Submission createEntity(EntityManager em) {
        Submission submission = new Submission()
            .fileLocation(DEFAULT_FILE_LOCATION)
            .grade(DEFAULT_GRADE)
            .date(DEFAULT_DATE);
        return submission;
    }

    @Before
    public void initTest() {
        submission = createEntity(em);
    }

    @Test
    @Transactional
    public void createSubmission() throws Exception {
        int databaseSizeBeforeCreate = submissionRepository.findAll().size();

        // Create the Submission
        restSubmissionMockMvc.perform(post("/api/submissions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(submission)))
            .andExpect(status().isCreated());

        // Validate the Submission in the database
        List<Submission> submissionList = submissionRepository.findAll();
        assertThat(submissionList).hasSize(databaseSizeBeforeCreate + 1);
        Submission testSubmission = submissionList.get(submissionList.size() - 1);
        assertThat(testSubmission.getFileLocation()).isEqualTo(DEFAULT_FILE_LOCATION);
        assertThat(testSubmission.getGrade()).isEqualTo(DEFAULT_GRADE);
        assertThat(testSubmission.getDate()).isEqualTo(DEFAULT_DATE);

        // Validate the Submission in Elasticsearch
        verify(mockSubmissionSearchRepository, times(1)).save(testSubmission);
    }

    @Test
    @Transactional
    public void createSubmissionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = submissionRepository.findAll().size();

        // Create the Submission with an existing ID
        submission.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubmissionMockMvc.perform(post("/api/submissions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(submission)))
            .andExpect(status().isBadRequest());

        // Validate the Submission in the database
        List<Submission> submissionList = submissionRepository.findAll();
        assertThat(submissionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Submission in Elasticsearch
        verify(mockSubmissionSearchRepository, times(0)).save(submission);
    }

    @Test
    @Transactional
    public void getAllSubmissions() throws Exception {
        // Initialize the database
        submissionRepository.saveAndFlush(submission);

        // Get all the submissionList
        restSubmissionMockMvc.perform(get("/api/submissions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(submission.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileLocation").value(hasItem(DEFAULT_FILE_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }
    
    @Test
    @Transactional
    public void getSubmission() throws Exception {
        // Initialize the database
        submissionRepository.saveAndFlush(submission);

        // Get the submission
        restSubmissionMockMvc.perform(get("/api/submissions/{id}", submission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(submission.getId().intValue()))
            .andExpect(jsonPath("$.fileLocation").value(DEFAULT_FILE_LOCATION.toString()))
            .andExpect(jsonPath("$.grade").value(DEFAULT_GRADE.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingSubmission() throws Exception {
        // Get the submission
        restSubmissionMockMvc.perform(get("/api/submissions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSubmission() throws Exception {
        // Initialize the database
        submissionRepository.saveAndFlush(submission);

        int databaseSizeBeforeUpdate = submissionRepository.findAll().size();

        // Update the submission
        Submission updatedSubmission = submissionRepository.findById(submission.getId()).get();
        // Disconnect from session so that the updates on updatedSubmission are not directly saved in db
        em.detach(updatedSubmission);
        updatedSubmission
            .fileLocation(UPDATED_FILE_LOCATION)
            .grade(UPDATED_GRADE)
            .date(UPDATED_DATE);

        restSubmissionMockMvc.perform(put("/api/submissions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSubmission)))
            .andExpect(status().isOk());

        // Validate the Submission in the database
        List<Submission> submissionList = submissionRepository.findAll();
        assertThat(submissionList).hasSize(databaseSizeBeforeUpdate);
        Submission testSubmission = submissionList.get(submissionList.size() - 1);
        assertThat(testSubmission.getFileLocation()).isEqualTo(UPDATED_FILE_LOCATION);
        assertThat(testSubmission.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testSubmission.getDate()).isEqualTo(UPDATED_DATE);

        // Validate the Submission in Elasticsearch
        verify(mockSubmissionSearchRepository, times(1)).save(testSubmission);
    }

    @Test
    @Transactional
    public void updateNonExistingSubmission() throws Exception {
        int databaseSizeBeforeUpdate = submissionRepository.findAll().size();

        // Create the Submission

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubmissionMockMvc.perform(put("/api/submissions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(submission)))
            .andExpect(status().isBadRequest());

        // Validate the Submission in the database
        List<Submission> submissionList = submissionRepository.findAll();
        assertThat(submissionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Submission in Elasticsearch
        verify(mockSubmissionSearchRepository, times(0)).save(submission);
    }

    @Test
    @Transactional
    public void deleteSubmission() throws Exception {
        // Initialize the database
        submissionRepository.saveAndFlush(submission);

        int databaseSizeBeforeDelete = submissionRepository.findAll().size();

        // Get the submission
        restSubmissionMockMvc.perform(delete("/api/submissions/{id}", submission.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Submission> submissionList = submissionRepository.findAll();
        assertThat(submissionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Submission in Elasticsearch
        verify(mockSubmissionSearchRepository, times(1)).deleteById(submission.getId());
    }

    @Test
    @Transactional
    public void searchSubmission() throws Exception {
        // Initialize the database
        submissionRepository.saveAndFlush(submission);
        when(mockSubmissionSearchRepository.search(queryStringQuery("id:" + submission.getId())))
            .thenReturn(Collections.singletonList(submission));
        // Search the submission
        restSubmissionMockMvc.perform(get("/api/_search/submissions?query=id:" + submission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(submission.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileLocation").value(hasItem(DEFAULT_FILE_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Submission.class);
        Submission submission1 = new Submission();
        submission1.setId(1L);
        Submission submission2 = new Submission();
        submission2.setId(submission1.getId());
        assertThat(submission1).isEqualTo(submission2);
        submission2.setId(2L);
        assertThat(submission1).isNotEqualTo(submission2);
        submission1.setId(null);
        assertThat(submission1).isNotEqualTo(submission2);
    }
}
