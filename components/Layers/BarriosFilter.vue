<script setup>
import { ref } from "vue";
import { barriosStore } from "@/stores/barrios";
import { layersStore } from "@/stores/layers";
import BarriosProperties from "@/components/Layers/BarriosProperties.vue";
import Card from "@/components/Card.vue";
const barrios = barriosStore();
let filtered = ref([]);
const layers = layersStore();

const handleSelectBarrio = (id, event) => {
  if (event.target.checked) {
    barrios.selectBarrio(id);
  } else {
    barrios.unselectBarrio(id);
  }
};

barrios.$subscribe(() => {
  filtered.value = barrios.data;
});

onBeforeMount(() => {
  filtered.value = barrios.data;
});

onUpdated(() => {
  console.log("Updated");
});

const toggleBarrio = (barrio) => {
  barrios.toggleBarrios(barrio);
};

const filter = (event) => {
  const query = event.target.value;
  if (query == "") {
    filtered.value = barrios.data;
  } else if (query != "") {
    const filteredBarrios = barrios.data.filter((barrio) =>
      barrio.name.toLowerCase().startsWith(query.toLowerCase())
    );
    filtered.value = filteredBarrios;
  } else {
    filtered.value = barrios.data;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <Transition name="fade">
    <!-- Absolute container to keep the cards together -->
    <Card :w-full="true">
      <div class="h-60 overflow-y-scroll">
        <div class="flex gap-5 py-2 items-center">
          <!--  <Icon name="uil:angle-down" class="text-2xl text-gray-400" /> -->
          <h3 class="font-bold my-1 w-1/3">Barrios</h3>
          <div class="w-1/2 relative mx-4">
            <Icon
              name="uil:search"
              class="absolute top-2 right-2 text-gray-400 font-bold"
            />
            <input
              type="text"
              name="filter"
              placeholder="Buscar..."
              class="bg-gray-100 border border-gray-300 px-2 py-1 rounded-lg outline-none text-sm h-7 outline-none focus:border-gray-300 w-full"
              @input="filter($event)"
            />
          </div>
        </div>

        <hr />
        <div class="text-sm" v-for="(barrio, index) in filtered" :key="id">
          <div
            class="bg-white px-2 py-1 border-b border-l border-r hover:bg-gray-100 cursor-pointer overflow-y-scroll"
          >
            <input
              :id="`checkbox-${barrio.id}`"
              type="checkbox"
              :value="barrio.id"
              class="mx-2"
              :checked="barrio.checked"
              :v-model="barrio.checked"
              :ref="layerCheckbox"
              @change="handleSelectBarrio(barrio.id, $event)"
            />
            <label :for="`checkbox-${barrio.id}`"> {{ barrio.name }}</label>
            <Icon
              v-if="barrio.toggled"
              name="ph:toggle-right-fill"
              class="float-right text-xl text-gray-800 hover:text-gray-800 duration-300"
              @click="toggleBarrio(barrio)"
              aria-label="Franjas visuales"
            />
            <Icon
              v-if="!barrio.toggled"
              name="uil:toggle-off"
              class="float-right text-xl text-gray-500 hover:text-gray-800 duration-300"
              @click="toggleBarrio(barrio)"
              aria-label="Franjas visuales"
            />
          </div>
        </div>
      </div>
      <BarriosProperties />
    </Card>
  </Transition>
</template>
