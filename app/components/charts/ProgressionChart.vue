<template>
  <div class="progression">
    <div class="exercise-selector">
      <select v-model="selectedExercise" class="exercise-select">
        <option v-for="name in exercises" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>
    <div class="progression__chart">
      <Line v-if="chartData" :data="chartData" :options="options" />
      <p v-else class="no-data">Нет данных для выбранного упражнения</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const DEFAULT_EXERCISES = ['Жим лёжа', 'Присед', 'Становая тяга']

const { data: exerciseList } = useExercises()
const selectedExercise = ref('Жим лёжа')

const exercises = computed(() => exerciseList.value || DEFAULT_EXERCISES)

const { data: progressionData } = useProgression(selectedExercise)

const chartData = computed(() => {
  if (!progressionData.value?.length) return null

  return {
    labels: progressionData.value.map(d => d.date),
    datasets: [{
      label: selectedExercise.value,
      data: progressionData.value.map(d => d.maxWeight),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
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
        label: (ctx: any) => `${ctx.parsed.y} кг`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        maxTicksLimit: 12,
        maxRotation: 45,
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: false,
      title: { display: true, text: 'кг' },
    },
  },
}
</script>

<style scoped>
.exercise-selector {
  margin-bottom: 12px;
}

.exercise-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
}

.progression__chart {
  position: relative;
  height: 250px;
}

.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px 0;
}
</style>
