package com.example.Teacher;

import com.example.Teacher.Model.Teacher;
import com.example.Teacher.Repository.TeacherRepository;
import com.example.Teacher.Service.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository repository;

    @InjectMocks
    private TeacherService service;

    private Teacher sampleTeacher;

    @BeforeEach
    void setUp() {
        sampleTeacher = new Teacher("John Doe", LocalDate.of(1980, 1, 1), "9876543210");
        sampleTeacher.setId(1L);
    }

    @Test
    void testCreateTeacher() {
        when(repository.save(sampleTeacher)).thenReturn(sampleTeacher);

        Teacher result = service.createTeacher(sampleTeacher);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(repository, times(1)).save(sampleTeacher);
    }

    @Test
    void testGetAllTeachers() {
        when(repository.findAll()).thenReturn(Arrays.asList(sampleTeacher));

        List<Teacher> result = service.getAllTeachers();

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getName());
        verify(repository, times(1)).findAll();
    }

    @Test
    void testGetTeacherByIdSuccess() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleTeacher));

        Teacher result = service.getTeacherById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetTeacherByIdNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getTeacherById(99L));
    }

    @Test
    void testUpdateTeacher() {
        Teacher updatedData = new Teacher("Jane Doe", LocalDate.of(1982, 2, 2), "5555555555");
        when(repository.findById(1L)).thenReturn(Optional.of(sampleTeacher));
        when(repository.save(any(Teacher.class))).thenReturn(sampleTeacher);

        Teacher result = service.updateTeacher(1L, updatedData);

        assertEquals("Jane Doe", result.getName());
        assertEquals("5555555555", result.getPh());
        verify(repository, times(1)).save(sampleTeacher);
    }

    @Test
    void testDeleteTeacher() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleTeacher));
        doNothing().when(repository).delete(sampleTeacher);

        assertDoesNotThrow(() -> service.deleteTeacher(1L));
        verify(repository, times(1)).delete(sampleTeacher);
    }
}
