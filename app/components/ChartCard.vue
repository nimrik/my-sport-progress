<template>
  <div class="chart-card">
    <h2 v-if="title" class="chart-card__title">{{ title }}</h2>
    <p v-if="subtitle" class="chart-card__subtitle">{{ subtitle }}</p>
    <div class="chart-card__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

.chart-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px;
}

.chart-card__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 16px;
}

.chart-card__body {
  position: relative;
  min-height: 250px;
}
</style>
