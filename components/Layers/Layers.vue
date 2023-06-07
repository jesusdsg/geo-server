<script setup lang="ts">
import BarriosFilter from "./BarriosFilter.vue";
import EjesFilter from "./EjesFilter.vue";
import Card from "@/components/Card.vue";
import Box from "@/components/Box.vue";
import { v4 as uuidv4 } from "uuid";
import { layersStore } from "@/stores/layers";
const layer = layersStore();

const selectLayer = (item: any, event: any) => {
  if (event.target.checked) {
    layer.selectLayer(item);
  } else {
    layer.unselectLayer(item);
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

<template>
  <!-- Cards Containers -->
  <div class="absolute left-2 z-50 top-28 shadow-sm md:w-40vw lg:w-30vw">
    <!-- Layers Container -->
    <div class="w-full">
      <Box title="Capas">
        <hr />
        <div class="h-70vh overflow-y-scroll">
          <div
            class="text-sm"
            v-for="({ id, name, checked, icon }, index) in layer.selected"
            :key="id"
          >
            <div
              class="bg-white px-2 py-1 border-b border-l border-r hover:bg-gray-100 cursor-pointer items-center"
              v-bind:class="{
                'bg-gray-200 hover:bg-gray-200 border-gray-300': checked,
              }"
            >
              <input
                :id="`checkbox-${id}`"
                type="checkbox"
                :value="id"
                class="mx-2"
                :checked="checked"
                :v-model="checked"
                :ref="layerCheckbox"
                @change="selectLayer({ id, name }, $event)"
              />
              <Icon :name="icon" class="mx-1 text-gray-800" />
              <label :for="`checkbox-${id}`">
                {{ name }}
                <div class="inline float-right cursor-pointer">
                  <Icon
                    v-if="checked"
                    name="uil:angle-up"
                    class="text-xl text-gray-600"
                  />
                  <Icon
                    v-if="!checked"
                    name="uil:angle-down"
                    class="text-xl text-gray-600"
                  /></div
              ></label>
            </div>
            <!-- Sub layers container -->
            <Transition name="slide-fade"
              ><div
                v-if="checked"
                class="bg-red-200 max-h-42 overflow-y-scroll w-full border-b-2"
              >
                <!-- Barrios Container -->
                <BarriosFilter v-if="id == 1 && checked" />
                <!-- Ejes Container -->
                <EjesFilter v-if="id == 7 && checked" />
                <!-- <EjesFilter /> -->
              </div></Transition
            >
          </div>
        </div>
      </Box>
    </div>
  </div>
</template>
