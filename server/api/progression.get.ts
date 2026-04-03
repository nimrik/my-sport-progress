import { getProgression } from '../utils/parser'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const exercise = (query.exercise as string) || 'Жим лёжа'
  return getProgression(exercise)
})
