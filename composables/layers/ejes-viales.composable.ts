import mapboxgl from "mapbox-gl";
import { ejesVialesStore } from "@/stores/ejes";
import data from "@/geo/ejes.json" assert { type: "json" };

const ejesStore = ejesVialesStore();

/* Add Ejes viales  */
const addEjesVialesByTipo = (map: any) => {
  /* throught tipos */
  ejesStore.tipos.map((tipo: { value: string; color: string }) => {
    const result = filterEjesByTipo(data.features, tipo.value);
    let ejesData: any = {
      type: "FeatureCollection",
      features: [],
    };
    /* Result to display ejes */
    if (result) {
      ejesData.features = result;
      if (!map.getLayer(`eje-vial-${tipo.value.toLowerCase()}`)) {
        map.addSource(`eje-vial-${tipo.value.toLowerCase()}`, {
          type: "geojson",
          data: ejesData,
        });
        map.addLayer({
          id: `eje-vial-layer-${tipo.value.toLowerCase()}`,
          type: "line",
          source: `eje-vial-${tipo.value.toLowerCase()}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
            visibility: "none",
          },
          paint: {
            "line-color": tipo.color,
            "line-opacity": 0.4,
            "line-width": 4,
          },
        });
        /* Map on click */
        map.on(
          "click",
          [`eje-vial-layer-${tipo.value.toLowerCase()}`],
          (e: any) => {
            new mapboxgl.Popup({ className: "map-popup" })
              .setLngLat(e.lngLat)
              .setHTML(
                `<div>${`<strong>TIPO:</strong> <span>${tipo.value}</span>`}</div>`
              )
              .addTo(map);
          }
        );
      }
    }
  });
};

/* Aux function to get the ejes from the json by TIPOSUPCAL */
const filterEjesByTipo = (features: any, tipo: string) => {
  const filtered = features.filter(function (feature: {
    properties: { TIPOSUPCAL: string };
  }) {
    return feature.properties?.TIPOSUPCAL === tipo;
  });
  return filtered;
};

const addEjesVialesLayer = (map: any, ejes: any) => {
  map.addSource("ejes-viales", {
    type: "geojson",
    data: data,
  });

  map.addLayer({
    id: "ejes-viales-layer",
    type: "line",
    source: "ejes-viales",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#85dd3b",
      "line-width": 3,
    },
  });

  /* Map on click */
  map.on("click", ["ejes-viales-layer"], (e: any) => {
    new mapboxgl.Popup({ className: "map-popup" })
      .setLngLat(e.lngLat)
      .setHTML(`<div>${"ejes-viales"}</div>`)
      .addTo(map);
  });
};

const removeEjesVialesLayer = (map: any, ejes: any) => {
  ejes.map((eje: any) => {
    try {
      map.removeLayer(eje.id);
      map.removeSource(eje.id);
    } catch (error) {}
  });
};

const toggleEjesVialesByType = (map: any, ejes: any) => {
  ejes.map((eje: any) => {
    eje.checked
      ? map.setLayoutProperty(
          `eje-vial-layer-${eje.value.toLowerCase()}`,
          "visibility",
          "visible"
        )
      : map.setLayoutProperty(
          `eje-vial-layer-${eje.value.toLowerCase()}`,
          "visibility",
          "none"
        );
  });
};

const showEjesVialesLayer = (map: any, ejes: any) => {
  ejes.map((eje: any) => {
    map.setLayoutProperty(
      `eje-vial-layer-${eje.value.toLowerCase()}`,
      "visibility",
      "visible"
    );
  });
};

const hideEjesVialesLayer = (map: any, ejes: any) => {
  ejes.map((eje: any) => {
    map.setLayoutProperty(
      `eje-vial-layer-${eje.value.toLowerCase()}`,
      "visibility",
      "none"
    );
  });
};

export {
  addEjesVialesLayer,
  removeEjesVialesLayer,
  showEjesVialesLayer,
  hideEjesVialesLayer,
  addEjesVialesByTipo,
  toggleEjesVialesByType,
};
