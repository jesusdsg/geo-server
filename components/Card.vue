<script setup lang="ts">
const { roundedRight, roundedLeft, wFull } = defineProps<{
  roundedRight?: boolean;
  roundedLeft?: boolean;
  wFull: boolean;
}>();
</script>

<template>
  <div
    class="bg-white border px-6 py-2 w-auto shadow-lg"
    v-bind:class="{
      'rounded-l-lg': roundedLeft,
      'rounded-r-lg': roundedRight,
      'w-full': wFull,
    }"
  >
    <slot />
  </div>
</template>
