package com.ayham.vcr.web.rest;

import com.ayham.vcr.VirtualClassroomApp;

import com.ayham.vcr.domain.ReadingMaterial;
import com.ayham.vcr.repository.ReadingMaterialRepository;
import com.ayham.vcr.repository.search.ReadingMaterialSearchRepository;
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
 * Test class for the ReadingMaterialResource REST controller.
 *
 * @see ReadingMaterialResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = VirtualClassroomApp.class)
public class ReadingMaterialResourceIntTest {

    private static final String DEFAULT_FILE_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_FILE_LOCATION = "BBBBBBBBBB";

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    @Autowired
    private ReadingMaterialRepository readingMaterialRepository;

    /**
     * This repository is mocked in the com.ayham.vcr.repository.search test package.
     *
     * @see com.ayham.vcr.repository.search.ReadingMaterialSearchRepositoryMockConfiguration
     */
    @Autowired
    private ReadingMaterialSearchRepository mockReadingMaterialSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restReadingMaterialMockMvc;

    private ReadingMaterial readingMaterial;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ReadingMaterialResource readingMaterialResource = new ReadingMaterialResource(readingMaterialRepository, mockReadingMaterialSearchRepository);
        this.restReadingMaterialMockMvc = MockMvcBuilders.standaloneSetup(readingMaterialResource)
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
    public static ReadingMaterial createEntity(EntityManager em) {
        ReadingMaterial readingMaterial = new ReadingMaterial()
            .fileLocation(DEFAULT_FILE_LOCATION)
            .title(DEFAULT_TITLE);
        return readingMaterial;
    }

    @Before
    public void initTest() {
        readingMaterial = createEntity(em);
    }

    @Test
    @Transactional
    public void createReadingMaterial() throws Exception {
        int databaseSizeBeforeCreate = readingMaterialRepository.findAll().size();

        // Create the ReadingMaterial
        restReadingMaterialMockMvc.perform(post("/api/reading-materials")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(readingMaterial)))
            .andExpect(status().isCreated());

        // Validate the ReadingMaterial in the database
        List<ReadingMaterial> readingMaterialList = readingMaterialRepository.findAll();
        assertThat(readingMaterialList).hasSize(databaseSizeBeforeCreate + 1);
        ReadingMaterial testReadingMaterial = readingMaterialList.get(readingMaterialList.size() - 1);
        assertThat(testReadingMaterial.getFileLocation()).isEqualTo(DEFAULT_FILE_LOCATION);
        assertThat(testReadingMaterial.getTitle()).isEqualTo(DEFAULT_TITLE);

        // Validate the ReadingMaterial in Elasticsearch
        verify(mockReadingMaterialSearchRepository, times(1)).save(testReadingMaterial);
    }

    @Test
    @Transactional
    public void createReadingMaterialWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = readingMaterialRepository.findAll().size();

        // Create the ReadingMaterial with an existing ID
        readingMaterial.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReadingMaterialMockMvc.perform(post("/api/reading-materials")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(readingMaterial)))
            .andExpect(status().isBadRequest());

        // Validate the ReadingMaterial in the database
        List<ReadingMaterial> readingMaterialList = readingMaterialRepository.findAll();
        assertThat(readingMaterialList).hasSize(databaseSizeBeforeCreate);

        // Validate the ReadingMaterial in Elasticsearch
        verify(mockReadingMaterialSearchRepository, times(0)).save(readingMaterial);
    }

    @Test
    @Transactional
    public void getAllReadingMaterials() throws Exception {
        // Initialize the database
        readingMaterialRepository.saveAndFlush(readingMaterial);

        // Get all the readingMaterialList
        restReadingMaterialMockMvc.perform(get("/api/reading-materials?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(readingMaterial.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileLocation").value(hasItem(DEFAULT_FILE_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())));
    }
    
    @Test
    @Transactional
    public void getReadingMaterial() throws Exception {
        // Initialize the database
        readingMaterialRepository.saveAndFlush(readingMaterial);

        // Get the readingMaterial
        restReadingMaterialMockMvc.perform(get("/api/reading-materials/{id}", readingMaterial.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(readingMaterial.getId().intValue()))
            .andExpect(jsonPath("$.fileLocation").value(DEFAULT_FILE_LOCATION.toString()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingReadingMaterial() throws Exception {
        // Get the readingMaterial
        restReadingMaterialMockMvc.perform(get("/api/reading-materials/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReadingMaterial() throws Exception {
        // Initialize the database
        readingMaterialRepository.saveAndFlush(readingMaterial);

        int databaseSizeBeforeUpdate = readingMaterialRepository.findAll().size();

        // Update the readingMaterial
        ReadingMaterial updatedReadingMaterial = readingMaterialRepository.findById(readingMaterial.getId()).get();
        // Disconnect from session so that the updates on updatedReadingMaterial are not directly saved in db
        em.detach(updatedReadingMaterial);
        updatedReadingMaterial
            .fileLocation(UPDATED_FILE_LOCATION)
            .title(UPDATED_TITLE);

        restReadingMaterialMockMvc.perform(put("/api/reading-materials")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedReadingMaterial)))
            .andExpect(status().isOk());

        // Validate the ReadingMaterial in the database
        List<ReadingMaterial> readingMaterialList = readingMaterialRepository.findAll();
        assertThat(readingMaterialList).hasSize(databaseSizeBeforeUpdate);
        ReadingMaterial testReadingMaterial = readingMaterialList.get(readingMaterialList.size() - 1);
        assertThat(testReadingMaterial.getFileLocation()).isEqualTo(UPDATED_FILE_LOCATION);
        assertThat(testReadingMaterial.getTitle()).isEqualTo(UPDATED_TITLE);

        // Validate the ReadingMaterial in Elasticsearch
        verify(mockReadingMaterialSearchRepository, times(1)).save(testReadingMaterial);
    }

    @Test
    @Transactional
    public void updateNonExistingReadingMaterial() throws Exception {
        int databaseSizeBeforeUpdate = readingMaterialRepository.findAll().size();

        // Create the ReadingMaterial

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReadingMaterialMockMvc.perform(put("/api/reading-materials")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(readingMaterial)))
            .andExpect(status().isBadRequest());

        // Validate the ReadingMaterial in the database
        List<ReadingMaterial> readingMaterialList = readingMaterialRepository.findAll();
        assertThat(readingMaterialList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ReadingMaterial in Elasticsearch
        verify(mockReadingMaterialSearchRepository, times(0)).save(readingMaterial);
    }

    @Test
    @Transactional
    public void deleteReadingMaterial() throws Exception {
        // Initialize the database
        readingMaterialRepository.saveAndFlush(readingMaterial);

        int databaseSizeBeforeDelete = readingMaterialRepository.findAll().size();

        // Get the readingMaterial
        restReadingMaterialMockMvc.perform(delete("/api/reading-materials/{id}", readingMaterial.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ReadingMaterial> readingMaterialList = readingMaterialRepository.findAll();
        assertThat(readingMaterialList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ReadingMaterial in Elasticsearch
        verify(mockReadingMaterialSearchRepository, times(1)).deleteById(readingMaterial.getId());
    }

    @Test
    @Transactional
    public void searchReadingMaterial() throws Exception {
        // Initialize the database
        readingMaterialRepository.saveAndFlush(readingMaterial);
        when(mockReadingMaterialSearchRepository.search(queryStringQuery("id:" + readingMaterial.getId())))
            .thenReturn(Collections.singletonList(readingMaterial));
        // Search the readingMaterial
        restReadingMaterialMockMvc.perform(get("/api/_search/reading-materials?query=id:" + readingMaterial.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(readingMaterial.getId().intValue())))
            .andExpect(jsonPath("$.[*].fileLocation").value(hasItem(DEFAULT_FILE_LOCATION.toString())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReadingMaterial.class);
        ReadingMaterial readingMaterial1 = new ReadingMaterial();
        readingMaterial1.setId(1L);
        ReadingMaterial readingMaterial2 = new ReadingMaterial();
        readingMaterial2.setId(readingMaterial1.getId());
        assertThat(readingMaterial1).isEqualTo(readingMaterial2);
        readingMaterial2.setId(2L);
        assertThat(readingMaterial1).isNotEqualTo(readingMaterial2);
        readingMaterial1.setId(null);
        assertThat(readingMaterial1).isNotEqualTo(readingMaterial2);
    }
}
