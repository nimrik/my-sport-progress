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
  data: Array<{ month: string; totalVolume: number; totalSets: number; totalReps: number }>
}>()

const chartData = computed(() => {
  if (!props.data?.length) return null

  return {
    labels: props.data.map(d => d.month),
    datasets: [
      {
        label: 'Объём (кг)',
        data: props.data.map(d => d.totalVolume),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: 'Подходы',
        data: props.data.map(d => d.totalSets),
        backgroundColor: '#10b981',
        borderRadius: 4,
        yAxisID: 'y1',
      },
    ],
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { usePointStyle: true, padding: 16 },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          if (ctx.datasetIndex === 0) {
            return `Объём: ${ctx.parsed.y.toLocaleString()} кг`
          }
          return `Подходы: ${ctx.parsed.y}`
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
          const monthNames = ['', 'Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д']
          return month === '01' ? year : monthNames[parseInt(month)]
        },
        maxRotation: 0,
      },
      grid: { display: false },
    },
    y: {
      type: 'linear' as const,
      position: 'left' as const,
      title: { display: true, text: 'Объём (кг)' },
      beginAtZero: true,
    },
    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      title: { display: true, text: 'Подходы' },
      beginAtZero: true,
      grid: { drawOnChartArea: false },
    },
  },
}
</script>
