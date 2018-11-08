package com.ayham.vcr.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ayham.vcr.domain.ReadingMaterial;
import com.ayham.vcr.repository.ReadingMaterialRepository;
import com.ayham.vcr.repository.search.ReadingMaterialSearchRepository;
import com.ayham.vcr.web.rest.errors.BadRequestAlertException;
import com.ayham.vcr.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing ReadingMaterial.
 */
@RestController
@RequestMapping("/api")
public class ReadingMaterialResource {

    private final Logger log = LoggerFactory.getLogger(ReadingMaterialResource.class);

    private static final String ENTITY_NAME = "readingMaterial";

    private final ReadingMaterialRepository readingMaterialRepository;

    private final ReadingMaterialSearchRepository readingMaterialSearchRepository;

    public ReadingMaterialResource(ReadingMaterialRepository readingMaterialRepository, ReadingMaterialSearchRepository readingMaterialSearchRepository) {
        this.readingMaterialRepository = readingMaterialRepository;
        this.readingMaterialSearchRepository = readingMaterialSearchRepository;
    }

    /**
     * POST  /reading-materials : Create a new readingMaterial.
     *
     * @param readingMaterial the readingMaterial to create
     * @return the ResponseEntity with status 201 (Created) and with body the new readingMaterial, or with status 400 (Bad Request) if the readingMaterial has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/reading-materials")
    @Timed
    public ResponseEntity<ReadingMaterial> createReadingMaterial(@RequestBody ReadingMaterial readingMaterial) throws URISyntaxException {
        log.debug("REST request to save ReadingMaterial : {}", readingMaterial);
        if (readingMaterial.getId() != null) {
            throw new BadRequestAlertException("A new readingMaterial cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ReadingMaterial result = readingMaterialRepository.save(readingMaterial);
        readingMaterialSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/reading-materials/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /reading-materials : Updates an existing readingMaterial.
     *
     * @param readingMaterial the readingMaterial to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated readingMaterial,
     * or with status 400 (Bad Request) if the readingMaterial is not valid,
     * or with status 500 (Internal Server Error) if the readingMaterial couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/reading-materials")
    @Timed
    public ResponseEntity<ReadingMaterial> updateReadingMaterial(@RequestBody ReadingMaterial readingMaterial) throws URISyntaxException {
        log.debug("REST request to update ReadingMaterial : {}", readingMaterial);
        if (readingMaterial.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ReadingMaterial result = readingMaterialRepository.save(readingMaterial);
        readingMaterialSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, readingMaterial.getId().toString()))
            .body(result);
    }

    /**
     * GET  /reading-materials : get all the readingMaterials.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of readingMaterials in body
     */
    @GetMapping("/reading-materials")
    @Timed
    public List<ReadingMaterial> getAllReadingMaterials() {
        log.debug("REST request to get all ReadingMaterials");
        return readingMaterialRepository.findAll();
    }

    /**
     * GET  /reading-materials/:id : get the "id" readingMaterial.
     *
     * @param id the id of the readingMaterial to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the readingMaterial, or with status 404 (Not Found)
     */
    @GetMapping("/reading-materials/{id}")
    @Timed
    public ResponseEntity<ReadingMaterial> getReadingMaterial(@PathVariable Long id) {
        log.debug("REST request to get ReadingMaterial : {}", id);
        Optional<ReadingMaterial> readingMaterial = readingMaterialRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(readingMaterial);
    }

    /**
     * DELETE  /reading-materials/:id : delete the "id" readingMaterial.
     *
     * @param id the id of the readingMaterial to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/reading-materials/{id}")
    @Timed
    public ResponseEntity<Void> deleteReadingMaterial(@PathVariable Long id) {
        log.debug("REST request to delete ReadingMaterial : {}", id);

        readingMaterialRepository.deleteById(id);
        readingMaterialSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/reading-materials?query=:query : search for the readingMaterial corresponding
     * to the query.
     *
     * @param query the query of the readingMaterial search
     * @return the result of the search
     */
    @GetMapping("/_search/reading-materials")
    @Timed
    public List<ReadingMaterial> searchReadingMaterials(@RequestParam String query) {
        log.debug("REST request to search ReadingMaterials for query {}", query);
        return StreamSupport
            .stream(readingMaterialSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
