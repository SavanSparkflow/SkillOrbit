import { create } from 'zustand';
import apiClient from '../api/apiClient';

export const useCourseStore = create((set, get) => ({
  courses: [],
  featuredCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  total: 0,

  // Fetch courses with filters
  fetchCourses: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get('/courses', { params });
      set({
        courses: res.data.courses,
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  // Fetch single course with curriculum
  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await apiClient.get(`/courses/${id}`);
      set({ currentCourse: res.data.course, loading: false });
      return res.data.course;
    } catch (err) {
      set({ loading: false, error: err.message });
      return null;
    }
  },

  // Enroll in course
  enrollInCourse: async (courseId) => {
    try {
      const res = await apiClient.post(`/courses/${courseId}/enroll`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
}));
