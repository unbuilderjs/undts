<script setup lang="tsx">
import testVueComponent from './test-vue-component.vue'

export interface Props {
  msg: string
}

defineProps<Props>()
</script>

<template>
  <div>
    Hello world!
    <testVueComponent msg="Hello" />
  </div>
</template>
