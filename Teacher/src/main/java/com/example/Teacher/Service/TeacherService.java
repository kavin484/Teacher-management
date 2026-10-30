package com.example.Teacher.Service;

import com.example.Teacher.Model.Teacher;
import com.example.Teacher.Repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {
    private final TeacherRepository repository;

    public TeacherService(TeacherRepository repository) {
        this.repository = repository;
    }

    // 1. Create Teacher
    public Teacher createTeacher(Teacher teacher) {
        return repository.save(teacher);
    }

    // 2. Read All Teachers
    public List<Teacher> getAllTeachers() {
        return repository.findAll();
    }

    // 3. Read Teacher By ID
    public Teacher getTeacherById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
    }

    // 4. Update Teacher
    public Teacher updateTeacher(Long id, Teacher updatedData) {
        Teacher existing = getTeacherById(id);
        existing.setName(updatedData.getName());
        existing.setDob(updatedData.getDob());


        existing.setPh(updatedData.getPh());
        return repository.save(existing);
    }

    // 5. Delete Teacher
    public void deleteTeacher(Long id) {
        Teacher existing = getTeacherById(id);
        repository.delete(existing);
    }
}