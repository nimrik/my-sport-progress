import { getMonthlyCounts } from '../utils/parser'

export default defineEventHandler(() => {
  return getMonthlyCounts()
})
