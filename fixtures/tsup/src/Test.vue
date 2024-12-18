<script setup lang="ts">
defineProps({
  /** Message of body */
  msg: String,
})
</script>

<template>
  <div>
    Hello world
  </div>
</template>

<style scoped lang="less">
@unocss all;
div {
  color: red;
}
</style>
