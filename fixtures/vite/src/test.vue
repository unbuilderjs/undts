<script setup lang="tsx">
defineProps<{ msg: string }>()
</script>

<template>
  <div>Hello world, {{ msg }}</div>
</template>
