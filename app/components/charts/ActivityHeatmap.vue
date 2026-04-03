<template>
  <div class="heatmap">
    <div v-for="yearData in yearGroups" :key="yearData.year" class="heatmap__year">
      <h3 class="heatmap__year-label">{{ yearData.year }}</h3>
      <div class="heatmap__wrap">
        <div class="heatmap__month-labels">
          <span
            v-for="ml in yearData.monthPositions"
            :key="ml.month"
            class="heatmap__month-label"
            :style="{ left: ml.offset + 'px' }"
          >{{ ml.label }}</span>
        </div>
        <div class="heatmap__grid" :style="{ width: yearData.gridWidth + 'px' }">
          <div
            v-for="(day, i) in yearData.days"
            :key="i"
            class="heatmap__cell"
            :class="getCellClass(day)"
            :title="day.date ? `${day.date}: ${day.count > 0 ? day.count + ' тренировок' : 'отдых'}` : ''"
          />
        </div>
      </div>
    </div>
    <div class="heatmap__legend">
      <span class="heatmap__legend-text">Меньше</span>
      <div class="heatmap__cell heatmap__cell--none" />
      <div class="heatmap__cell heatmap__cell--low" />
      <div class="heatmap__cell heatmap__cell--high" />
      <span class="heatmap__legend-text">Больше</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const CELL_SIZE = 11
const GAP = 2
const COL_WIDTH = CELL_SIZE + GAP

const props = defineProps<{
  data: Array<{ date: string; workoutCount: number }>
}>()

const monthLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

interface DayCell {
  date: string | null
  count: number
}

interface MonthPosition {
  month: number
  label: string
  offset: number
}

interface YearGroup {
  year: number
  days: DayCell[]
  monthPositions: MonthPosition[]
  gridWidth: number
}

function getMondayBasedDay(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1 // Mon=0, Sun=6
}

const yearGroups = computed((): YearGroup[] => {
  if (!props.data?.length) return []

  const dateMap = new Map<string, number>()
  for (const d of props.data) {
    dateMap.set(d.date, d.workoutCount)
  }

  const years = new Set(props.data.map(d => parseInt(d.date.substring(0, 4))))
  const result: YearGroup[] = []

  for (const year of [...years].sort()) {
    const days: DayCell[] = []
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)

    // Pad start to Monday
    const startPad = getMondayBasedDay(start)
    for (let i = 0; i < startPad; i++) {
      days.push({ date: null, count: 0 })
    }

    // Track which column each month starts at
    const monthStartCols: number[] = []
    let currentMonth = -1

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const m = d.getMonth()
      if (m !== currentMonth) {
        // Column index = total cells so far / 7 (rows)
        const col = Math.floor(days.length / 7)
        monthStartCols.push(col)
        currentMonth = m
      }
      const dateStr = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      days.push({ date: dateStr, count: dateMap.get(dateStr) || 0 })
    }

    const totalCols = Math.ceil(days.length / 7)
    const gridWidth = totalCols * COL_WIDTH

    const monthPositions: MonthPosition[] = monthStartCols.map((col, i) => ({
      month: i,
      label: monthLabels[i],
      offset: col * COL_WIDTH,
    }))

    result.push({ year, days, monthPositions, gridWidth })
  }

  return result
})

function getCellClass(day: DayCell): string {
  if (!day.date) return 'heatmap__cell--empty'
  if (day.count === 0) return 'heatmap__cell--none'
  if (day.count === 1) return 'heatmap__cell--low'
  return 'heatmap__cell--high'
}
</script>

<style scoped>
.heatmap {
  overflow-x: auto;
}

.heatmap__year {
  margin-bottom: 24px;
}

.heatmap__year-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.heatmap__wrap {
  display: inline-block;
}

.heatmap__month-labels {
  position: relative;
  height: 16px;
  margin-bottom: 4px;
}

.heatmap__month-label {
  position: absolute;
  font-size: 0.625rem;
  color: #6b7280;
  white-space: nowrap;
}

.heatmap__grid {
  display: grid;
  grid-template-rows: repeat(7, 11px);
  grid-auto-flow: column;
  grid-auto-columns: 11px;
  gap: 2px;
}

.heatmap__cell {
  width: 11px;
  height: 11px;
  border-radius: 2px;
}

.heatmap__cell--empty {
  background: transparent;
}

.heatmap__cell--none {
  background: #ebedf0;
}

.heatmap__cell--low {
  background: #40c463;
}

.heatmap__cell--high {
  background: #216e39;
}

.heatmap__legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.heatmap__legend-text {
  font-size: 0.625rem;
  color: #6b7280;
}
</style>
