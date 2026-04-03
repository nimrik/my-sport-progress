import { readFileSync, statSync } from 'fs'
import { resolve } from 'node:path'
import { lookupExercise, type ExerciseInfo } from './exercises'

// --- Types ---

export interface ParsedSet {
  weight: number
  reps: number
  sets: number
}

export interface ParsedExercise {
  name: string
  muscleGroup: string
  sets: ParsedSet[]
}

export interface ParsedWorkout {
  date: string
  messageId: number
  exercises: ParsedExercise[]
  source?: string
}

export interface MonthlyCount {
  month: string
  count: number
}

interface TelegramMessage {
  id: number
  type: string
  date: string
  text: string | Array<string | { type: string; text: string }>
  text_entities?: Array<{ type: string; text: string }>
  forwarded_from?: string
  forwarded_from_id?: string
  reply_to_message_id?: number
}

interface TelegramExport {
  messages: TelegramMessage[]
}

// --- Helpers ---

let cachedData: TelegramExport | null = null
let cachedMtime: number | null = null

export function loadData(): TelegramExport {
  const filePath = resolve(process.cwd(), 'data.json')
  const mtime = statSync(filePath).mtimeMs
  if (cachedData && cachedMtime === mtime) return cachedData
  // File changed — clear all caches
  parsedWorkouts = null
  parsedMonthlyCounts = null
  const raw = readFileSync(filePath, 'utf-8')
  cachedData = JSON.parse(raw)
  cachedMtime = mtime
  return cachedData!
}

export function extractText(text: string | Array<string | { type: string; text: string }>): string {
  if (typeof text === 'string') return text
  return text.map(t => typeof t === 'string' ? t : t.text).join('')
}

// Cyrillic "х" (U+0445) and Latin "x" (U+0078)
const SET_LINE_REGEX = /^(\d+(?:[.,]\d+)?)\s*[хx]\s*(\d+)(?:\s*[хx]\s*(\d+))?$/i
const INLINE_SET_REGEX = /(\d+)\s*[хx]\s*(\d+(?:-\d+)*)(?:\s*[хx]\s*(\d+))?$/i
const WEIGHT_RANGE_REGEX = /^(\d+)-(\d+)$/

function parseSetLine(line: string): ParsedSet[] | null {
  const trimmed = line.trim()
  const match = trimmed.match(SET_LINE_REGEX)
  if (!match) return null

  const weight = parseFloat(match[1].replace(',', '.'))
  const second = parseInt(match[2])
  const third = match[3] ? parseInt(match[3]) : undefined

  if (third !== undefined) {
    return [{ weight, reps: second, sets: third }]
  }
  return [{ weight, reps: second, sets: 1 }]
}

function parseInlineSets(text: string): { name: string; sets: ParsedSet[] } | null {
  const match = text.match(INLINE_SET_REGEX)
  if (!match) return null

  const name = text.substring(0, match.index!).trim()
  if (!name || name.length < 3) return null

  const first = parseInt(match[1])
  const secondStr = match[2]
  const third = match[3] ? parseInt(match[3]) : undefined

  // Handle "4х10-8-8-8" pattern (sets x varying reps)
  if (secondStr.includes('-') && !third) {
    const repsList = secondStr.split('-').map(Number)
    return {
      name,
      sets: repsList.map(reps => ({ weight: 0, reps, sets: 1 })),
    }
  }

  const second = parseInt(secondStr)
  if (third !== undefined) {
    // "Бабочка 27х16х4" - could be weight×reps×sets or sets×reps
    // If first number is small (<=6) and no exercise context, likely sets×reps
    // But with weight context (>10), likely weight×reps×sets
    if (first >= 10) {
      return { name, sets: [{ weight: first, reps: second, sets: third }] }
    }
    return { name, sets: [{ weight: 0, reps: second, sets: first }] }
  }

  // "4х12" at end of exercise name = sets × reps (no weight)
  if (first <= 6 && second >= 6) {
    return { name, sets: [{ weight: 0, reps: second, sets: first }] }
  }

  return { name, sets: [{ weight: first, reps: second, sets: 1 }] }
}

// --- Core Parsing ---

function parseWorkoutText(text: string): ParsedExercise[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const exercises: ParsedExercise[] = []

  let currentExercise: { info: ExerciseInfo; name: string; sets: ParsedSet[] } | null = null

  for (const line of lines) {
    // Try to parse as a set line (just numbers)
    const setResult = parseSetLine(line)
    if (setResult && currentExercise) {
      currentExercise.sets.push(...setResult)
      continue
    }

    // Try bodyweight line like "С.в. Х 3 х2"
    const bwMatch = line.match(/^с\.?в\.?\s*[хx]\s*(\d+)\s*(?:[хx]\s*(\d+))?$/i)
    if (bwMatch && currentExercise) {
      const reps = parseInt(bwMatch[1])
      const sets = bwMatch[2] ? parseInt(bwMatch[2]) : 1
      currentExercise.sets.push({ weight: 0, reps, sets })
      continue
    }

    // Try inline sets on the same line as exercise name
    const inlineResult = parseInlineSets(line)
    if (inlineResult) {
      // Flush previous exercise
      if (currentExercise && currentExercise.sets.length > 0) {
        exercises.push({
          name: currentExercise.info.canonical,
          muscleGroup: currentExercise.info.muscleGroup,
          sets: currentExercise.sets,
        })
      }

      const info = lookupExercise(inlineResult.name)
      if (info) {
        currentExercise = { info, name: inlineResult.name, sets: inlineResult.sets }
      } else {
        currentExercise = null
      }
      continue
    }

    // Try as exercise name line
    const info = lookupExercise(line)
    if (info) {
      // Flush previous exercise
      if (currentExercise && currentExercise.sets.length > 0) {
        exercises.push({
          name: currentExercise.info.canonical,
          muscleGroup: currentExercise.info.muscleGroup,
          sets: currentExercise.sets,
        })
      }
      currentExercise = { info, name: line, sets: [] }
      continue
    }

    // Handle "Разминочный х16" or weight range lines like "50-60х16х4"
    if (currentExercise) {
      const rangeMatch = line.match(/^(\d+)-(\d+)\s*[хx]\s*(\d+)(?:\s*[хx]\s*(\d+))?$/i)
      if (rangeMatch) {
        const weight = parseInt(rangeMatch[2]) // take higher
        const reps = parseInt(rangeMatch[3])
        const sets = rangeMatch[4] ? parseInt(rangeMatch[4]) : 1
        currentExercise.sets.push({ weight, reps, sets })
        continue
      }

      // "Разминочный х16" or "разминочный"
      const warmupMatch = line.match(/^разминочн\w*\s*(?:[хx]\s*(\d+))?$/i)
      if (warmupMatch) {
        if (warmupMatch[1]) {
          currentExercise.sets.push({ weight: 0, reps: parseInt(warmupMatch[1]), sets: 1 })
        }
        continue
      }
    }
  }

  // Flush last exercise
  if (currentExercise && currentExercise.sets.length > 0) {
    exercises.push({
      name: currentExercise.info.canonical,
      muscleGroup: currentExercise.info.muscleGroup,
      sets: currentExercise.sets,
    })
  }

  return exercises
}

const MONTH_NAMES: Record<string, number> = {
  'январь': 1, 'февраль': 2, 'март': 3, 'апрель': 4,
  'май': 5, 'июнь': 6, 'июль': 7, 'август': 8,
  'сентябрь': 9, 'октябрь': 10, 'ноябрь': 11, 'декабрь': 12,
}

function parseMonthlyCount(text: string, date: string): MonthlyCount | null {
  const lower = text.toLowerCase().trim()

  // "Октябрь тренировки: 12" or "Октябрь тренировки:12"
  const match1 = lower.match(/^(\S+)\s*тренировк\w*[:\s]+(\d+)/)
  if (match1) {
    const monthNum = MONTH_NAMES[match1[1]]
    if (monthNum) {
      const year = new Date(date).getFullYear()
      return { month: `${year}-${String(monthNum).padStart(2, '0')}`, count: parseInt(match1[2]) }
    }
  }

  // "Июнь\n14 тренировок"
  const match2 = lower.match(/^(\S+)\n(\d+)\s*тренировк/)
  if (match2) {
    const monthNum = MONTH_NAMES[match2[1]]
    if (monthNum) {
      const year = new Date(date).getFullYear()
      return { month: `${year}-${String(monthNum).padStart(2, '0')}`, count: parseInt(match2[2]) }
    }
  }

  return null
}

function isWorkoutCounter(text: string): boolean {
  return /^тренировка\s+\d+/i.test(text.trim())
}

function hasExerciseContent(text: string): boolean {
  // Must contain at least one weight×reps pattern
  return /\d+\s*[хx]\s*\d+/i.test(text)
}

// --- Public API ---

let parsedWorkouts: ParsedWorkout[] | null = null
let parsedMonthlyCounts: MonthlyCount[] | null = null
let workoutDates: Set<string> | null = null

export function getWorkouts(): ParsedWorkout[] {
  if (parsedWorkouts) return parsedWorkouts

  const data = loadData()
  const workouts: ParsedWorkout[] = []

  for (const msg of data.messages) {
    if (msg.type !== 'message') continue
    const text = extractText(msg.text)
    if (!text || !hasExerciseContent(text)) continue
    if (isWorkoutCounter(text)) continue

    const exercises = parseWorkoutText(text)
    if (exercises.length === 0) continue

    workouts.push({
      date: msg.date,
      messageId: msg.id,
      exercises,
      source: msg.forwarded_from,
    })
  }

  parsedWorkouts = workouts
  return workouts
}

export function getMonthlyCounts(): MonthlyCount[] {
  if (parsedMonthlyCounts) return parsedMonthlyCounts

  const data = loadData()
  const explicitCounts = new Map<string, number>()

  // First: gather explicit monthly counts from messages
  for (const msg of data.messages) {
    if (msg.type !== 'message') continue
    const text = extractText(msg.text)
    const count = parseMonthlyCount(text, msg.date)
    if (count) {
      explicitCounts.set(count.month, count.count)
    }
  }

  // Second: count workout counter messages per month
  const counterCounts = new Map<string, number>()
  for (const msg of data.messages) {
    if (msg.type !== 'message') continue
    const text = extractText(msg.text)
    if (isWorkoutCounter(text)) {
      const month = msg.date.substring(0, 7)
      counterCounts.set(month, (counterCounts.get(month) || 0) + 1)
    }
  }

  // Third: count workout log messages per month (for months without explicit/counter data)
  const logCounts = new Map<string, Set<string>>()
  for (const workout of getWorkouts()) {
    const month = workout.date.substring(0, 7)
    const day = workout.date.substring(0, 10)
    if (!logCounts.has(month)) logCounts.set(month, new Set())
    logCounts.get(month)!.add(day)
  }

  // Merge: explicit > counter > log-based
  const allMonths = new Set([
    ...explicitCounts.keys(),
    ...counterCounts.keys(),
    ...logCounts.keys(),
  ])

  const result: MonthlyCount[] = []
  for (const month of [...allMonths].sort()) {
    const count = explicitCounts.get(month)
      ?? counterCounts.get(month)
      ?? logCounts.get(month)?.size
      ?? 0
    if (count > 0) {
      result.push({ month, count })
    }
  }

  parsedMonthlyCounts = result
  return result
}

export function getWorkoutDates(): Array<{ date: string; workoutCount: number }> {
  const workouts = getWorkouts()
  const dayCounts = new Map<string, number>()

  for (const w of workouts) {
    const day = w.date.substring(0, 10)
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1)
  }

  // Also count workout counter messages as workout days
  const data = loadData()
  for (const msg of data.messages) {
    if (msg.type !== 'message') continue
    const text = extractText(msg.text)
    if (isWorkoutCounter(text)) {
      const day = msg.date.substring(0, 10)
      if (!dayCounts.has(day)) {
        dayCounts.set(day, 1)
      }
    }
  }

  return [...dayCounts.entries()]
    .map(([date, workoutCount]) => ({ date, workoutCount }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getAllExerciseNames(): string[] {
  const workouts = getWorkouts()
  const names = new Set<string>()
  for (const w of workouts) {
    for (const e of w.exercises) {
      names.add(e.name)
    }
  }
  return [...names].sort()
}

export function getProgression(exerciseName: string): Array<{ date: string; maxWeight: number }> {
  const workouts = getWorkouts()
  const result: Array<{ date: string; maxWeight: number }> = []

  for (const w of workouts) {
    for (const e of w.exercises) {
      if (e.name === exerciseName) {
        const maxWeight = Math.max(...e.sets.map(s => s.weight), 0)
        if (maxWeight > 0) {
          result.push({ date: w.date.substring(0, 10), maxWeight })
        }
      }
    }
  }

  return result.sort((a, b) => a.date.localeCompare(b.date))
}

export function getDistribution(): Array<{ muscleGroup: string; totalSets: number }> {
  const workouts = getWorkouts()
  const counts = new Map<string, number>()

  for (const w of workouts) {
    for (const e of w.exercises) {
      const total = e.sets.reduce((sum, s) => sum + s.sets, 0)
      counts.set(e.muscleGroup, (counts.get(e.muscleGroup) || 0) + total)
    }
  }

  return [...counts.entries()]
    .map(([muscleGroup, totalSets]) => ({ muscleGroup, totalSets }))
    .sort((a, b) => b.totalSets - a.totalSets)
}

export function getVolume(): Array<{ month: string; totalVolume: number; totalSets: number; totalReps: number }> {
  const workouts = getWorkouts()
  const monthly = new Map<string, { volume: number; sets: number; reps: number }>()

  for (const w of workouts) {
    const month = w.date.substring(0, 7)
    if (!monthly.has(month)) monthly.set(month, { volume: 0, sets: 0, reps: 0 })
    const m = monthly.get(month)!

    for (const e of w.exercises) {
      for (const s of e.sets) {
        const totalReps = s.reps * s.sets
        m.volume += s.weight * totalReps
        m.sets += s.sets
        m.reps += totalReps
      }
    }
  }

  return [...monthly.entries()]
    .map(([month, data]) => ({
      month,
      totalVolume: Math.round(data.volume),
      totalSets: data.sets,
      totalReps: data.reps,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
