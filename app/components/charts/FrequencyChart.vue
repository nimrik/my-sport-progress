<template>
  <Bar v-if="chartData" :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: Array<{ month: string; count: number }>
}>()

const YEAR_COLORS: Record<string, string> = {
  '2022': '#3b82f6',
  '2023': '#10b981',
  '2024': '#f59e0b',
  '2025': '#ef4444',
  '2026': '#8b5cf6',
}

const chartData = computed(() => {
  if (!props.data?.length) return null

  const labels = props.data.map(d => d.month)
  const colors = props.data.map(d => YEAR_COLORS[d.month.substring(0, 4)] || '#6b7280')

  return {
    labels,
    datasets: [{
      label: 'Тренировок в месяц',
      data: props.data.map(d => d.count),
      backgroundColor: colors,
      borderRadius: 4,
    }],
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (items: any[]) => {
          const label = items[0]?.label || ''
          const [year, month] = label.split('-')
          const monthNames = ['', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
          return `${monthNames[parseInt(month)]} ${year}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        callback: function (_: any, index: number) {
          const label = props.data[index]?.month || ''
          const [year, month] = label.split('-')
          const monthNames = ['', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
          if (month === '01') return `Янв ${year}`
          if (month === '07') return `Июл ${year}`
          return monthNames[parseInt(month)]
        },
        maxRotation: 45,
        autoSkip: false,
        font: { size: 10 },
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 2 },
    },
  },
}
</script>
