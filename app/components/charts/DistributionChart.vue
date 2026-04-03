<template>
  <Doughnut v-if="chartData" :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: Array<{ muscleGroup: string; totalSets: number }>
}>()

const MUSCLE_LABELS: Record<string, string> = {
  chest: 'Грудь',
  back: 'Спина',
  legs: 'Ноги',
  shoulders: 'Плечи',
  arms: 'Руки',
  core: 'Кор',
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#ef4444',
  back: '#3b82f6',
  legs: '#10b981',
  shoulders: '#f59e0b',
  arms: '#8b5cf6',
  core: '#ec4899',
}

const chartData = computed(() => {
  if (!props.data?.length) return null

  return {
    labels: props.data.map(d => MUSCLE_LABELS[d.muscleGroup] || d.muscleGroup),
    datasets: [{
      data: props.data.map(d => d.totalSets),
      backgroundColor: props.data.map(d => MUSCLE_COLORS[d.muscleGroup] || '#6b7280'),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { padding: 16, usePointStyle: true },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = ((ctx.parsed / total) * 100).toFixed(1)
          return `${ctx.label}: ${ctx.parsed} подходов (${pct}%)`
        },
      },
    },
  },
  cutout: '55%',
}
</script>
