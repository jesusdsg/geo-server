import { ejesVialesStore } from "@/stores/ejes";
import data from "@/geo/matrices.json" assert { type: "json" };
import mapboxgl from "mapbox-gl";

const getMatrices = () => {
  console.log("DAAATA DE MATRICES ", data);
  const result = getUniqueMatriculas();
  //console.log("eeeee result ", result);
  //addMatricesLayerByMatriculas();
};

const addMatricesLayerByMatriculas = (map: any) => {
  /* Add color */
  data.features.map((feature: any) => {
    feature.properties.color = getRandomColor();
  });

  map.addSource("matrices", {
    type: "geojson",
    data: data,
  });

  map.addLayer({
    id: "matrices-layer",
    type: "fill",
    source: "matrices",
    layout: {
      visibility: "none",
    },
    paint: {
      //"fill-color": "#2e4e5d", // blue color fill
      "fill-color": ["get", "color"],
      "fill-opacity": 0.3,
    },
  });

  map.on("click", "matrices-layer", (e: any) => {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>MATRICULA: </strong><span>${e.features[0].properties.MATRICULA1}</span>`
      )
      .addTo(map);
  });
};

const showMatricesLayer = (map: any) => {
  console.log("Showing");
  console.log(map.getLayer("matrices-layer"));
  try {
    map.setLayoutProperty("matrices-layer", "visibility", "visible");
  } catch (error) {
    console.log("Error", error);
  }
};

const hideMatricesLayer = (map: any) => {
  console.log("Hidding");
  try {
    map.setLayoutProperty("matrices-layer", "visibility", "none");
  } catch (error) {
    console.log("Error", error);
  }
};

/* Get Unique Matriculas */
const getUniqueMatriculas = () => {
  return Array.from(
    new Set(data.features.map((a: any) => a.properties.MATRICULA1))
  );
};

export {
  getMatrices,
  addMatricesLayerByMatriculas,
  showMatricesLayer,
  hideMatricesLayer,
};
