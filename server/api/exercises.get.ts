import { getAllExerciseNames } from '../utils/parser'

export default defineEventHandler(() => {
  return getAllExerciseNames()
})
