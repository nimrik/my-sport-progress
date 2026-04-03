export function useFrequency() {
  return useFetch<Array<{ month: string; count: number }>>('/api/frequency')
}

export function useProgression(exercise: Ref<string> | string) {
  return useFetch<Array<{ date: string; maxWeight: number }>>('/api/progression', {
    query: { exercise },
    watch: typeof exercise === 'string' ? undefined : [exercise],
  })
}

export function useDistribution() {
  return useFetch<Array<{ muscleGroup: string; totalSets: number }>>('/api/distribution')
}

export function useVolume() {
  return useFetch<Array<{ month: string; totalVolume: number; totalSets: number; totalReps: number }>>('/api/volume')
}

export function useTimeline() {
  return useFetch<Array<{ date: string; workoutCount: number }>>('/api/timeline')
}

export function useExercises() {
  return useFetch<string[]>('/api/exercises')
}
