<script setup lang="ts">
import { layersStore } from "@/stores/layers";
import { barriosStore } from "@/stores/barrios";
import { franjasStore } from "@/stores/franjas";
import { elementsStore } from "@/stores/elements";
import Card from "@/components/Card.vue";
const layers = layersStore();
const franjas = franjasStore();
const config = useRuntimeConfig();
const barrios = barriosStore();
const elements = elementsStore();

/* Get the toggled properties and then display */
barrios.$subscribe(() => {
  getProperties();
});

const getProperties = () => {
  if (barrios.current.properties) {
    /* Get toggled properties */
    const toggled = barrios.current.properties.filter(
      (x: { toggled: boolean }) => x.toggled
    );
    /* Loop the toggled properties to show in map */
    if (toggled) {
      toggled.map((property: any) => {
        /* Franjas viales id */
        property.id == 1 ? getFranjasViales(barrios.current.id) : null;
        /* Vertices id */
      });
    }
  }
};

const getFranjasViales = async (id: string) => {
  if (id) {
    elements.showSpinner();
    const { data, error, execute, pending, refresh } = await useFetch(
      `${config.baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/barrios/${id}/franjas-viales`,
      {
        onRequest({ request, options }) {},
        onRequestError({ request, options, error }) {},
        async onResponse({ request, response, options }) {
          franjas.setFranjas(response._data);
          franjas.setRecent(response._data);
          elements.hideSpinner();
        },
        onResponseError({ request, response, options }) {},
      }
    );
  }
};

const handleSelectProperty = (idBarrio: string, idProperty: number) => {
  barrios.toggleProperties(idBarrio, idProperty);
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
    <div
      class="w-52 lg:w-64 fixed top-40 left-30vw"
      v-if="layers.selected[0].checked && barrios.current && barrios.current.id"
    >
      <Card :w-full="false" :rounded-right="true">
        <div class="h-32 overflow-y-scroll">
          <div class="flex gap-5 py-2 items-center">
            <h3 class="font-bold my-1 w-full flex items-center gap-1">
              <Icon name="uil:angle-right-b" class="text-gray-600" />
              {{ barrios.current.name }}
            </h3>
          </div>

          <hr />
          <div
            class="text-sm"
            v-for="({ id, name, toggled }, index) in barrios.current.properties"
            :key="index"
          >
            <div
              class="bg-white px-2 py-1 border-b border-l border-r hover:bg-gray-100 cursor-pointer overflow-y-scroll"
            >
              <label :for="`checkbox-${id}`">{{ name }}</label>
              <Icon
                v-if="toggled"
                name="ph:toggle-right-fill"
                class="float-right text-xl text-gray-800 hover:text-gray-800 duration-300"
                @click="handleSelectProperty(barrios.current.id, id)"
                aria-label="Franjas visuales"
              />
              <Icon
                v-if="!toggled"
                name="uil:toggle-off"
                class="float-right text-xl text-gray-500 hover:text-gray-800 duration-300"
                @click="handleSelectProperty(barrios.current.id, id)"
                aria-label="Franjas visuales"
              />
            </div>
          </div></div
      ></Card></div
  ></Transition>
</template>
