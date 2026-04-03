import { getWorkoutDates } from '../utils/parser'

export default defineEventHandler(() => {
  return getWorkoutDates()
})
