<script setup lang="ts">
import { ref } from "vue";
const { title } = defineProps<{
  title?: string;
}>();

let visible = ref(true);
</script>

<template>
  <div v-if="visible" class="bg-white w-auto rounded-lg shadow-lg">
    <div
      class="bg-gray-600 text-white rounded-t-lg py-1 px-6 items-center flex justify-between"
    >
      <span>{{ title || "Card" }}</span>
      <Icon
        name="uil:multiply"
        class="cursor-pointer hover:text-gray-300 rounded-sm duration-400"
        @click="visible = false"
      />
    </div>
    <div class="px-6 py-2"><slot /></div>
  </div>
</template>
