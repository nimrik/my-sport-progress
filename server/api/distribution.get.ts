import { getDistribution } from '../utils/parser'

export default defineEventHandler(() => {
  return getDistribution()
})
