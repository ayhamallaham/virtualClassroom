package com.ayham.vcr.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.ayham.vcr.domain.Assignment;
import com.ayham.vcr.repository.AssignmentRepository;
import com.ayham.vcr.repository.search.AssignmentSearchRepository;
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
 * REST controller for managing Assignment.
 */
@RestController
@RequestMapping("/api")
public class AssignmentResource {

    private final Logger log = LoggerFactory.getLogger(AssignmentResource.class);

    private static final String ENTITY_NAME = "assignment";

    private final AssignmentRepository assignmentRepository;

    private final AssignmentSearchRepository assignmentSearchRepository;

    public AssignmentResource(AssignmentRepository assignmentRepository, AssignmentSearchRepository assignmentSearchRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentSearchRepository = assignmentSearchRepository;
    }

    /**
     * POST  /assignments : Create a new assignment.
     *
     * @param assignment the assignment to create
     * @return the ResponseEntity with status 201 (Created) and with body the new assignment, or with status 400 (Bad Request) if the assignment has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/assignments")
    @Timed
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) throws URISyntaxException {
        log.debug("REST request to save Assignment : {}", assignment);
        if (assignment.getId() != null) {
            throw new BadRequestAlertException("A new assignment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Assignment result = assignmentRepository.save(assignment);
        assignmentSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/assignments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /assignments : Updates an existing assignment.
     *
     * @param assignment the assignment to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated assignment,
     * or with status 400 (Bad Request) if the assignment is not valid,
     * or with status 500 (Internal Server Error) if the assignment couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/assignments")
    @Timed
    public ResponseEntity<Assignment> updateAssignment(@RequestBody Assignment assignment) throws URISyntaxException {
        log.debug("REST request to update Assignment : {}", assignment);
        if (assignment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Assignment result = assignmentRepository.save(assignment);
        assignmentSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, assignment.getId().toString()))
            .body(result);
    }

    /**
     * GET  /assignments : get all the assignments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of assignments in body
     */
    @GetMapping("/assignments")
    @Timed
    public List<Assignment> getAllAssignments() {
        log.debug("REST request to get all Assignments");
        return assignmentRepository.findAll();
    }

    /**
     * GET  /assignments/:id : get the "id" assignment.
     *
     * @param id the id of the assignment to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the assignment, or with status 404 (Not Found)
     */
    @GetMapping("/assignments/{id}")
    @Timed
    public ResponseEntity<Assignment> getAssignment(@PathVariable Long id) {
        log.debug("REST request to get Assignment : {}", id);
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(assignment);
    }

    /**
     * DELETE  /assignments/:id : delete the "id" assignment.
     *
     * @param id the id of the assignment to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/assignments/{id}")
    @Timed
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        log.debug("REST request to delete Assignment : {}", id);

        assignmentRepository.deleteById(id);
        assignmentSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/assignments?query=:query : search for the assignment corresponding
     * to the query.
     *
     * @param query the query of the assignment search
     * @return the result of the search
     */
    @GetMapping("/_search/assignments")
    @Timed
    public List<Assignment> searchAssignments(@RequestParam String query) {
        log.debug("REST request to search Assignments for query {}", query);
        return StreamSupport
            .stream(assignmentSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
