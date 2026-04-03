<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">Sport Tracker</h1>
      <p class="dashboard__subtitle">Аналитика тренировок 2022 — 2026</p>
    </header>

    <div class="dashboard__grid">
      <ChartCard title="Частота тренировок" subtitle="Количество тренировок в месяц" class="dashboard__card--wide">
        <div class="chart-container">
          <ClientOnly>
            <ChartsFrequencyChart v-if="frequency" :data="frequency" />
          </ClientOnly>
        </div>
      </ChartCard>

      <ChartCard title="Прогресс в упражнениях" subtitle="Максимальный вес по тренировкам">
        <div class="chart-container">
          <ClientOnly>
            <ChartsProgressionChart />
          </ClientOnly>
        </div>
      </ChartCard>

      <ChartCard title="Распределение по группам мышц" subtitle="Общее количество подходов">
        <div class="chart-container">
          <ClientOnly>
            <ChartsDistributionChart v-if="distribution" :data="distribution" />
          </ClientOnly>
        </div>
      </ChartCard>

      <ChartCard title="Объём тренировок" subtitle="Общий тоннаж и количество подходов в месяц" class="dashboard__card--wide">
        <div class="chart-container">
          <ClientOnly>
            <ChartsVolumeChart v-if="volume" :data="volume" />
          </ClientOnly>
        </div>
      </ChartCard>

      <ChartCard title="Календарь активности" subtitle="Дни тренировок" class="dashboard__card--wide">
        <ChartsActivityHeatmap v-if="timeline" :data="timeline" />
      </ChartCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: frequency } = useFrequency()
const { data: distribution } = useDistribution()
const { data: volume } = useVolume()
const { data: timeline } = useTimeline()
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.dashboard__header {
  margin-bottom: 32px;
}

.dashboard__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
}

.dashboard__subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.dashboard__card--wide {
  grid-column: 1 / -1;
}

.chart-container {
  position: relative;
  height: 300px;
}

@media (max-width: 768px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 16px;
  }
}
</style>
