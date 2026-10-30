package com.example.Teacher;

import com.example.Teacher.Model.Teacher;
import com.example.Teacher.Repository.TeacherRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        teacherRepository.deleteAll();
    }

    @Test
    void testCreateTeacher() throws Exception {
        Teacher teacher = new Teacher("Alice Smith", LocalDate.of(1985, 5, 20), "1234567890");

        mockMvc.perform(post("/api/teachers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(teacher)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Alice Smith"))
                .andExpect(jsonPath("$.ph").value("1234567890"));
    }

    @Test
    void testGetAllTeachers() throws Exception {
        Teacher teacher1 = teacherRepository.save(new Teacher("Alice Smith", LocalDate.of(1985, 5, 20), "1234567890"));
        Teacher teacher2 = teacherRepository.save(new Teacher("Bob Jones", LocalDate.of(1990, 8, 15), "0987654321"));

        mockMvc.perform(get("/api/teachers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Alice Smith"))
                .andExpect(jsonPath("$[1].name").value("Bob Jones"));
    }

    @Test
    void testGetTeacherById() throws Exception {
        Teacher saved = teacherRepository.save(new Teacher("Alice Smith", LocalDate.of(1985, 5, 20), "1234567890"));

        mockMvc.perform(get("/api/teachers/" + saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.name").value("Alice Smith"));
    }

    @Test
    void testUpdateTeacher() throws Exception {
        Teacher saved = teacherRepository.save(new Teacher("Alice Smith", LocalDate.of(1985, 5, 20), "1234567890"));
        Teacher updateData = new Teacher("Alice Updated", LocalDate.of(1985, 5, 20), "1112223333");

        mockMvc.perform(put("/api/teachers/" + saved.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice Updated"))
                .andExpect(jsonPath("$.ph").value("1112223333"));
    }

    @Test
    void testDeleteTeacher() throws Exception {
        Teacher saved = teacherRepository.save(new Teacher("Alice Smith", LocalDate.of(1985, 5, 20), "1234567890"));

        mockMvc.perform(delete("/api/teachers/" + saved.getId()))
                .andExpect(status().isNoContent());

        assertFalse(teacherRepository.findById(saved.getId()).isPresent());
    }
}
