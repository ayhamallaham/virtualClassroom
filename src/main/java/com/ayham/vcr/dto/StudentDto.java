package com.ayham.vcr.dto;

import com.ayham.vcr.domain.Student;
import com.ayham.vcr.domain.StudyGroup;
import com.ayham.vcr.domain.Submission;

import java.util.HashSet;
import java.util.Set;

public class StudentDto {

    private Long id;

    private Set<StudyGroup> groups = new HashSet<>();

    private Set<Submission> submissions = new HashSet<>();

    private String name;

    public StudentDto(Student student){
        this.groups = student.getGroups();
        this.id = student.getId();
        this.name = student.getUser().getFirstName() + " " + student.getUser().getLastName();
        this.submissions = student.getSubmissions();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<StudyGroup> getGroups() {
        return groups;
    }

    public void setGroups(Set<StudyGroup> groups) {
        this.groups = groups;
    }

    public Set<Submission> getSubmissions() {
        return submissions;
    }

    public void setSubmissions(Set<Submission> submissions) {
        this.submissions = submissions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
