<script setup lang="tsx">
defineProps<{ msg: string }>()
</script>

<template>
  <div flex="~">
    Hello world, {{ msg }}
  </div>
</template>

<style lang="less" scoped>
div {
  color: red;
}
</style>
