package com.ayham.vcr.web.rest;

import com.ayham.vcr.VirtualClassroomApp;

import com.ayham.vcr.domain.StudyGroup;
import com.ayham.vcr.repository.StudyGroupRepository;
import com.ayham.vcr.repository.search.StudyGroupSearchRepository;
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
import java.util.Collections;
import java.util.List;


import static com.ayham.vcr.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the StudyGroupResource REST controller.
 *
 * @see StudyGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = VirtualClassroomApp.class)
public class StudyGroupResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    /**
     * This repository is mocked in the com.ayham.vcr.repository.search test package.
     *
     * @see com.ayham.vcr.repository.search.StudyGroupSearchRepositoryMockConfiguration
     */
    @Autowired
    private StudyGroupSearchRepository mockStudyGroupSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restStudyGroupMockMvc;

    private StudyGroup studyGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StudyGroupResource studyGroupResource = new StudyGroupResource(studyGroupRepository, mockStudyGroupSearchRepository);
        this.restStudyGroupMockMvc = MockMvcBuilders.standaloneSetup(studyGroupResource)
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
    public static StudyGroup createEntity(EntityManager em) {
        StudyGroup studyGroup = new StudyGroup()
            .name(DEFAULT_NAME)
            .capacity(DEFAULT_CAPACITY);
        return studyGroup;
    }

    @Before
    public void initTest() {
        studyGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createStudyGroup() throws Exception {
        int databaseSizeBeforeCreate = studyGroupRepository.findAll().size();

        // Create the StudyGroup
        restStudyGroupMockMvc.perform(post("/api/study-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(studyGroup)))
            .andExpect(status().isCreated());

        // Validate the StudyGroup in the database
        List<StudyGroup> studyGroupList = studyGroupRepository.findAll();
        assertThat(studyGroupList).hasSize(databaseSizeBeforeCreate + 1);
        StudyGroup testStudyGroup = studyGroupList.get(studyGroupList.size() - 1);
        assertThat(testStudyGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStudyGroup.getCapacity()).isEqualTo(DEFAULT_CAPACITY);

        // Validate the StudyGroup in Elasticsearch
        verify(mockStudyGroupSearchRepository, times(1)).save(testStudyGroup);
    }

    @Test
    @Transactional
    public void createStudyGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = studyGroupRepository.findAll().size();

        // Create the StudyGroup with an existing ID
        studyGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudyGroupMockMvc.perform(post("/api/study-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(studyGroup)))
            .andExpect(status().isBadRequest());

        // Validate the StudyGroup in the database
        List<StudyGroup> studyGroupList = studyGroupRepository.findAll();
        assertThat(studyGroupList).hasSize(databaseSizeBeforeCreate);

        // Validate the StudyGroup in Elasticsearch
        verify(mockStudyGroupSearchRepository, times(0)).save(studyGroup);
    }

    @Test
    @Transactional
    public void getAllStudyGroups() throws Exception {
        // Initialize the database
        studyGroupRepository.saveAndFlush(studyGroup);

        // Get all the studyGroupList
        restStudyGroupMockMvc.perform(get("/api/study-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studyGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)));
    }
    
    @Test
    @Transactional
    public void getStudyGroup() throws Exception {
        // Initialize the database
        studyGroupRepository.saveAndFlush(studyGroup);

        // Get the studyGroup
        restStudyGroupMockMvc.perform(get("/api/study-groups/{id}", studyGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(studyGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY));
    }

    @Test
    @Transactional
    public void getNonExistingStudyGroup() throws Exception {
        // Get the studyGroup
        restStudyGroupMockMvc.perform(get("/api/study-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStudyGroup() throws Exception {
        // Initialize the database
        studyGroupRepository.saveAndFlush(studyGroup);

        int databaseSizeBeforeUpdate = studyGroupRepository.findAll().size();

        // Update the studyGroup
        StudyGroup updatedStudyGroup = studyGroupRepository.findById(studyGroup.getId()).get();
        // Disconnect from session so that the updates on updatedStudyGroup are not directly saved in db
        em.detach(updatedStudyGroup);
        updatedStudyGroup
            .name(UPDATED_NAME)
            .capacity(UPDATED_CAPACITY);

        restStudyGroupMockMvc.perform(put("/api/study-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStudyGroup)))
            .andExpect(status().isOk());

        // Validate the StudyGroup in the database
        List<StudyGroup> studyGroupList = studyGroupRepository.findAll();
        assertThat(studyGroupList).hasSize(databaseSizeBeforeUpdate);
        StudyGroup testStudyGroup = studyGroupList.get(studyGroupList.size() - 1);
        assertThat(testStudyGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStudyGroup.getCapacity()).isEqualTo(UPDATED_CAPACITY);

        // Validate the StudyGroup in Elasticsearch
        verify(mockStudyGroupSearchRepository, times(1)).save(testStudyGroup);
    }

    @Test
    @Transactional
    public void updateNonExistingStudyGroup() throws Exception {
        int databaseSizeBeforeUpdate = studyGroupRepository.findAll().size();

        // Create the StudyGroup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudyGroupMockMvc.perform(put("/api/study-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(studyGroup)))
            .andExpect(status().isBadRequest());

        // Validate the StudyGroup in the database
        List<StudyGroup> studyGroupList = studyGroupRepository.findAll();
        assertThat(studyGroupList).hasSize(databaseSizeBeforeUpdate);

        // Validate the StudyGroup in Elasticsearch
        verify(mockStudyGroupSearchRepository, times(0)).save(studyGroup);
    }

    @Test
    @Transactional
    public void deleteStudyGroup() throws Exception {
        // Initialize the database
        studyGroupRepository.saveAndFlush(studyGroup);

        int databaseSizeBeforeDelete = studyGroupRepository.findAll().size();

        // Get the studyGroup
        restStudyGroupMockMvc.perform(delete("/api/study-groups/{id}", studyGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<StudyGroup> studyGroupList = studyGroupRepository.findAll();
        assertThat(studyGroupList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the StudyGroup in Elasticsearch
        verify(mockStudyGroupSearchRepository, times(1)).deleteById(studyGroup.getId());
    }

    @Test
    @Transactional
    public void searchStudyGroup() throws Exception {
        // Initialize the database
        studyGroupRepository.saveAndFlush(studyGroup);
        when(mockStudyGroupSearchRepository.search(queryStringQuery("id:" + studyGroup.getId())))
            .thenReturn(Collections.singletonList(studyGroup));
        // Search the studyGroup
        restStudyGroupMockMvc.perform(get("/api/_search/study-groups?query=id:" + studyGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(studyGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudyGroup.class);
        StudyGroup studyGroup1 = new StudyGroup();
        studyGroup1.setId(1L);
        StudyGroup studyGroup2 = new StudyGroup();
        studyGroup2.setId(studyGroup1.getId());
        assertThat(studyGroup1).isEqualTo(studyGroup2);
        studyGroup2.setId(2L);
        assertThat(studyGroup1).isNotEqualTo(studyGroup2);
        studyGroup1.setId(null);
        assertThat(studyGroup1).isNotEqualTo(studyGroup2);
    }
}
