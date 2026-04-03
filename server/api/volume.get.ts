import { getVolume } from '../utils/parser'

export default defineEventHandler(() => {
  return getVolume()
})
