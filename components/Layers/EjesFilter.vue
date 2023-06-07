<script setup>
import Card from "@/components/Card.vue";
import { layersStore } from "@/stores/layers";
import { ejesVialesStore } from "@/stores/ejes";
import { ref } from "vue";
const layers = layersStore();
const ejes = ejesVialesStore();
let filtered = ref([]);

onBeforeMount(() => {
  filtered.value = ejes.tipos;
});

const handleSelectTipo = (id, event) => {
  if (event.target.checked) {
    ejes.selectTipo(id);
  } else {
    ejes.unselectTipo(id);
  }
};

const filter = (event) => {
  const query = event.target.value;
  if (query == "") {
    filtered.value = ejes.tipos;
  } else if (query != "") {
    const filteredTipos = ejes.tipos.filter((tipo) =>
      tipo.value.toLowerCase().startsWith(query.toLowerCase())
    );
    filtered.value = filteredTipos;
  } else {
    filtered.value = ejes.tipos;
  }
};
</script>

<template>
  <Transition name="fade">
    <Card :w-full="false"
      ><div class="h-60 overflow-y-scroll">
        <div class="flex gap-5 py-2 items-center">
          <Icon name="uil:angle-down" class="text-2xl text-gray-400" />
          <h3 class="font-bold my-1 w-1/2">Ejes viales</h3>
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
        <div class="text-sm" v-for="(tipo, index) in filtered" :key="id">
          <div
            class="bg-white px-2 py-1 border-b border-l border-r hover:bg-gray-100 cursor-pointer overflow-y-scroll flex items-center gap-2"
          >
            <input
              :id="`checkbox-${tipo.id}`"
              type="checkbox"
              :value="tipo.id"
              class="mx-2"
              :checked="tipo.checked"
              :v-model="tipo.checked"
              :ref="layerCheckbox"
              @change="handleSelectTipo(tipo.id, $event)"
            />
            <div
              v-bind:style="{ 'background-color': tipo.color }"
              class="h-4 w-4 rounded-sm"
            ></div>
            <label :for="`checkbox-${tipo.id}`"> {{ tipo.value }}</label>

            <!-- <Icon
              v-if="tipo.toggled"
              name="ph:toggle-right-fill"
              class="float-right text-xl text-gray-800 hover:text-gray-800 duration-300"
              @click="toggleBarrio(barrio)"
              aria-label="Franjas visuales"
            />
            <Icon
              v-if="!tipo.toggled"
              name="uil:toggle-off"
              class="float-right text-xl text-gray-500 hover:text-gray-800 duration-300"
              @click="toggleBarrio(barrio)"
              aria-label="Franjas visuales"
            /> -->
          </div>
        </div>
      </div></Card
    >
  </Transition>
</template>
