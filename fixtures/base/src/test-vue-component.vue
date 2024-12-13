<script setup lang="ts">
export interface Props {
  /** Hello world */
  msg: string
}

defineProps<Props>()
</script>

<template>
  <div>Hello world, {{ msg }}</div>
</template>
