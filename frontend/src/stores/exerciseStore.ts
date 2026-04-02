
import { create } from 'zustand'
import { ExerciseResponse, ExerciseFilter } from '../api/exerciseApi'

interface ExerciseState {
  exercises: ExerciseResponse[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  filters: ExerciseFilter
  isLoading: boolean
  selectedExercise: ExerciseResponse | null
  
  setExercisesPage: (exercises: ExerciseResponse[], pageData: { page: number; totalElements: number; totalPages: number }) => void
  appendExercises: (newExercises: ExerciseResponse[]) => void
  setFilters: (filters: ExerciseFilter) => void
  setSelectedExercise: (exercise: ExerciseResponse | null) => void
  addExercise: (exercise: ExerciseResponse) => void
  updateExercise: (id: string, exercise: ExerciseResponse) => void
  removeExercise: (id: string) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  exercises: [],
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 20,
  filters: { page: 0, size: 20 },
  isLoading: false,
  selectedExercise: null,
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  ...initialState,
  
  setExercisesPage: (exercises, pageData) => set({
    exercises,
    currentPage: pageData.page,
    totalElements: pageData.totalElements,
    totalPages: pageData.totalPages,
  }),
  
  appendExercises: (newExercises) => set((state) => ({
    exercises: [...state.exercises, ...newExercises],
  })),
  
  setFilters: (filters) => set({ filters }),
  
  setSelectedExercise: (exercise) => set({ selectedExercise: exercise }),
  
  addExercise: (exercise) => set((state) => ({
    exercises: [exercise, ...state.exercises],
    totalElements: state.totalElements + 1,
  })),
  
  updateExercise: (id, updatedExercise) => set((state) => ({
    exercises: state.exercises.map((e) => e.id === id ? updatedExercise : e),
    selectedExercise: state.selectedExercise?.id === id ? updatedExercise : state.selectedExercise,
  })),
  
  removeExercise: (id) => set((state) => ({
    exercises: state.exercises.filter((e) => e.id !== id),
    selectedExercise: state.selectedExercise?.id === id ? null : state.selectedExercise,
    totalElements: state.totalElements - 1,
  })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  reset: () => set(initialState),
}))