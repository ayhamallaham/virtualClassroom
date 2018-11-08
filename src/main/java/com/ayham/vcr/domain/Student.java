package com.ayham.vcr.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "student")
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "student")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<StudyGroup> groups = new HashSet<>();

    @OneToMany(mappedBy = "student")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Submission> submissions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<StudyGroup> getGroups() {
        return groups;
    }

    public Student groups(Set<StudyGroup> studyGroups) {
        this.groups = studyGroups;
        return this;
    }

    public Student addGroup(StudyGroup studyGroup) {
        this.groups.add(studyGroup);
        studyGroup.setStudent(this);
        return this;
    }

    public Student removeGroup(StudyGroup studyGroup) {
        this.groups.remove(studyGroup);
        studyGroup.setStudent(null);
        return this;
    }

    public void setGroups(Set<StudyGroup> studyGroups) {
        this.groups = studyGroups;
    }

    public Set<Submission> getSubmissions() {
        return submissions;
    }

    public Student submissions(Set<Submission> submissions) {
        this.submissions = submissions;
        return this;
    }

    public Student addSubmission(Submission submission) {
        this.submissions.add(submission);
        submission.setStudent(this);
        return this;
    }

    public Student removeSubmission(Submission submission) {
        this.submissions.remove(submission);
        submission.setStudent(null);
        return this;
    }

    public void setSubmissions(Set<Submission> submissions) {
        this.submissions = submissions;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Student student = (Student) o;
        if (student.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), student.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            "}";
    }
}
