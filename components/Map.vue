<script setup>
import Card from "@/components/Card.vue";
import Layers from "@/components/Layers/Layers.vue";
import { ref } from "vue";
import { layersStore } from "@/stores/layers";
import { viasStore } from "@/stores/vias";
import { ejesVialesStore } from "@/stores/ejes";
import { urbanizacionesStore } from "@/stores/urbanizaciones";
import { franjasStore } from "@/stores/franjas";
import { elementsStore } from "@/stores/elements";
import {
  addMainSourceLayer,
  addMainControls,
} from "@/composables/map/map.composable";
import {
  getBarrios,
  addBarriosLayer,
  showSelectedBarriosLayer,
  hideBarriosLayer,
} from "@/composables/layers/barrios.composable";
import {
  getVias,
  addViasLayer,
  addViasLegalizadasLayer,
  removeViasLayer,
  showViasLayer,
  hideViasLayer,
} from "@/composables/layers/vias.composable";
import {
  addEjesVialesLayer,
  showEjesVialesLayer,
  hideEjesVialesLayer,
  addEjesVialesByTipo,
  toggleEjesVialesByType,
} from "@/composables/layers/ejes-viales.composable";
import {
  getUrbanizaciones,
  addUrbanizacionesLayer,
  showUrbanizaciones,
  hideUrbanizaciones,
} from "@/composables/layers/urbanizaciones.composable";
import {
  getMatrices,
  addMatricesLayerByMatriculas,
  showMatricesLayer,
  hideMatricesLayer,
} from "@/composables/layers/matrices.composable";
//import { formatBarriosForStore } from "@/composables/layers/barrios.composable";
import { barriosStore } from "@/stores/barrios";
import { getSelectedLayerByName } from "@/composables/layers/layers.composable";
import {
  addFranjasVialesLayer,
  removeFranjasVialesLayer,
} from "@/composables/layers/franjas.composable";
import { useToast } from "vue-toastification";
const layers = layersStore();
const barrios = barriosStore();
const vias = viasStore();
const ejes = ejesVialesStore();
const urbanizaciones = urbanizacionesStore();
const franjas = franjasStore();
const elements = elementsStore();
const config = useRuntimeConfig();
let coordinates = ref([]);
let lat = 5.071141366321286;
let lng = -74.60319488752802;
let metadatas = ref([]);
let showInfoCard = ref(false);
let showLayers = ref(false);
let loadedBarrios = ref(false);
const toast = useToast();

elements.showSpinner();
/**
 * Get the main municipio data to set the limits
 */
const getMunicipios = async () => {
  const { data, error, execute, pending, refresh } = await useFetch(
    `${config.baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/`,
    {
      onRequest({ request, options }) {},
      onRequestError({ request, options, error }) {},
      async onResponse({ request, response, options }) {
        // Process the response data
        lat = await response._data.latitude;
        lng = await response._data.longitude;
        coordinates.value = await response._data.limite.coordinates[0];
        let municipioMetadatas = await response._data.metadatas;
        metadatas.value = formatMetadatas(municipioMetadatas);
      },
      onResponseError({ request, response, options }) {},
    }
  );
};

const formatMetadatas = (municipioMetadatas) => {
  let format = [];
  municipioMetadatas.map((meta) => {
    if (meta.property == MunicipiosMetadatasTypes.DEPARTAMENTO) {
      meta.property = "DEPARTAMENTO";
      format.push(meta);
    }
    if (meta.property == MunicipiosMetadatasTypes.MUNICIPIO) {
      meta.property = "MUNICIPIO";
      format.push(meta);
    }
    if (meta.property == MunicipiosMetadatasTypes.ENTIDAD) {
      meta.property = "ENTIDAD";
      format.push(meta);
    }
    if (meta.property == MunicipiosMetadatasTypes.AREA_KM2) {
      meta.property = "AREA KM2";
      format.push(meta);
    }
  });
  return format;
};

const toggleLayers = () => {
  showLayers.value = !showLayers.value;
};

const toggleInfoCard = () => {
  showInfoCard.value = !showInfoCard.value;
};

onBeforeMount(async () => {
  getMunicipios();
  getBarrios(config.baseURL);
  getVias(config.baseURL);
  getUrbanizaciones(config.baseURL);
  elements.hideSpinner();
});

/* Callback to load after map loads */
useMapbox("map", (map) => {
  /* On load map */
  map.on("load", () => {
    /* Create main lay for map */
    watch(coordinates, () => {
      addMainSourceLayer(map, coordinates);
    });

    /**
     * Observers to detect changes in main data sources
     */

    /* Change when vias are loaded */
    vias.$subscribe(() => {
      elements.hideSpinner();
      addViasLayer(map, vias.data);
      addViasLegalizadasLayer(map, vias.legalizadas);
    });

    addEjesVialesByTipo(map);
    getMatrices();
    addMatricesLayerByMatriculas(map);

    /* Change when ejes are loaded */
    ejes.$subscribe(() => {
      if (layers.selected[6].checked) {
        toggleEjesVialesByType(map, ejes.tipos);
      }
    });

    urbanizaciones.$subscribe(() => {
      addUrbanizacionesLayer(map, urbanizaciones.data);
    });

    franjas.$subscribe(() => {
      franjas.data.length > 0
        ? addFranjasVialesLayer(map, franjas.data)
        : toast.warning("No se encontraron franjas");
    });

    /* Change when selected barrios */
    barrios.$subscribe(() => {
      /* Remove the current franjas on toggled on */
      if (barrios.current) {
        franjas.recent.length > 0
          ? removeFranjasVialesLayer(map, franjas.recent)
          : null;
      }
      /* Load barrios or show if are already loaded */
      if (!loadedBarrios.value) {
        addBarriosLayer(map, barrios.data);
        loadedBarrios.value = true;
      } else {
        showSelectedBarriosLayer(map, barrios.data);
      }
    });

    /* Get the changes in selected layers  */
    layers.$subscribe((mutation, state) => {
      const selectedBarrios = getSelectedLayerByName("Barrios", state.selected);
      selectedBarrios
        ? showSelectedBarriosLayer(map, barrios.data)
        : hideBarriosLayer(map, barrios.data);
      const selectedVias = getSelectedLayerByName("Vias", state.selected);
      selectedVias
        ? showViasLayer(map, vias.data)
        : hideViasLayer(map, vias.data);
      const selectedViasLegalizadas = getSelectedLayerByName(
        "Vias legalizadas",
        state.selected
      );
      selectedViasLegalizadas
        ? showViasLayer(map, vias.legalizadas)
        : hideViasLayer(map, vias.legalizadas);
      const selectedEjesViales = getSelectedLayerByName(
        "Ejes viales",
        state.selected
      );
      selectedEjesViales
        ? toggleEjesVialesByType(map, ejes.tipos)
        : hideEjesVialesLayer(map, ejes.tipos);
      const selectedUrbanizaciones = getSelectedLayerByName(
        "Urbanizaciones",
        state.selected
      );
      selectedUrbanizaciones
        ? showUrbanizaciones(map, urbanizaciones.data)
        : hideUrbanizaciones(map, urbanizaciones.data);
      const selectedMatrices = getSelectedLayerByName(
        "Matrices",
        state.selected
      );
      selectedMatrices ? showMatricesLayer(map) : hideMatricesLayer(map);
      console.log("Selected Matrices", selectedMatrices);
    });

    addMainControls(map);

    /* Map on click */
    /* map.on("click", ["maine", "outline"], (e) => {
      showInfoCard.value = true;
    }); */
    map.flyTo({
      center: [lng, lat], // Fly to the selected target
      duration: 12000, // Animate over 12 seconds
      essential: true, // This animation is considered essential with respect to prefers-reduced-motion
      zoom: 12,
    });
  });
});
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
  <!-- Spinner to load resources -->
  <Spinner v-if="elements.spinner" />

  <!-- Show layers button -->
  <div class="flex gap-2 absolute top-16 left-2 z-50">
    <div>
      <button
        type="button"
        class="px-2 py-1 rounded bg-white shadow-lg text-gray-600 hover:text-gray-800 hover:bg-gray-400 duration-300"
        @click="toggleLayers()"
      >
        <Icon name="uil:layer-group" class="text-xl" />
      </button>
    </div>

    <!-- Show metadatas button -->
    <div>
      <button
        type="button"
        class="px-2 py-1 rounded bg-white shadow-lg text-gray-600 hover:text-gray-800 hover:bg-gray-400 duration-300"
        @click="toggleInfoCard()"
      >
        <Icon name="uil:info-circle" class="text-xl" />
      </button>
    </div>
  </div>

  <!-- Layers card -->
  <Transition name="fade"><Layers v-if="showLayers" /></Transition>

  <!-- Metadatas card -->
  <Transition name="fade">
    <div v-if="showInfoCard" class="absolute top-2 right-2 z-50">
      <Box title="Información">
        <!-- <Icon
          name="uil:times"
          class="text-2xl absolute right-4 cursor-pointer text-gray-500 bg-gray-200/60 rounded-lg hover:text-gray-800"
          @click="showInfoCard = false"
        /> -->
        <div
          class="grid grid-cols-2 text-sm"
          v-for="(item, index) in metadatas"
        >
          <div class="uppercase font-semibold text-gray-800">
            {{ item.property }}:
          </div>
          <div class="text-gray-600">{{ item.value }}</div>
        </div>
      </Box>
    </div>
  </Transition>

  <MapboxMap
    map-id="map"
    class="relative top-0 bottom-0 left-0 w-full h-full"
    :options="{
      style: 'mapbox://styles/devjesg/cli4n5fae052301p8aimlgydt', // style URL
      center: [lng, lat], // municipality sabanalarga
      zoom: 10, // starting zoom
    }"
  ></MapboxMap>
</template>
