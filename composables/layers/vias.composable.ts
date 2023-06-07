import { viasStore } from "@/stores/vias";
import mapboxgl from "mapbox-gl";
import { elementsStore } from "~/stores/elements";

const vias = viasStore();
const elements = elementsStore();

const getVias = async (baseURL: string) => {
  elements.showSpinner();
  await useFetch(
    `${baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/vias/`,
    {
      async onResponse({ request, response, options }) {
        vias.setVias(response._data);
        elements.hideSpinner();
      },
    }
  );
};

/**
 * Add Vias to the map
 * @param map
 * @param vias
 */
const addViasLayer = (map: any, vias: any) => {
  vias.map((via: any) => {
    try {
      map.addSource(via.id, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: via.geo,
        },
      });

      map.addLayer({
        id: via.id,
        type: "line",
        source: via.id, // reference the data source
        layout: {
          "line-join": "round",
          "line-cap": "round",
          visibility: "none",
        },
        paint: {
          "line-color": "#ffb366",
          "line-width": 2,
        },
      });

      const metadatasHTML = getViasMetadatas(via.metadatas);
      /* Map on click */
      map.on("click", [via.id], (e: any) => {
        new mapboxgl.Popup({ className: "map-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${metadatasHTML}</div>`)
          .addTo(map);
      });
    } catch (error) {
      console.error(error);
    }
  });
};

/**
 * Add Vias legalizadas
 * @param map
 * @param vias
 */
const addViasLegalizadasLayer = (map: any, vias: any) => {
  vias.map((via: any) => {
    try {
      map.addSource(via.id, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: via.geo,
        },
      });

      map.addLayer({
        id: via.id,
        type: "fill",
        source: via.id, // reference the data source
        layout: {
          visibility: "none",
        },
        paint: {
          "fill-color": getRandomColor(), // blue color fill
          "fill-opacity": 0.6,
        },
      });

      const metadatasHTML = getViasLegalizadasMetadatas(via.metadatas);
      /* Map on click */
      map.on("click", [via.id], (e: any) => {
        new mapboxgl.Popup({ className: "map-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${metadatasHTML}</div>`)
          .addTo(map);
      });
    } catch (error) {
      console.error(error);
    }
  });
};

/**
 * Remove vias
 * @param map
 * @param barrios
 */
const removeViasLayer = (map: any, vias: any) => {
  vias.map((via: any) => {
    try {
      map.removeLayer(via.id);
      map.removeSource(via.id);
    } catch (error) {}
  });
};

const showViasLayer = (map: any, vias: any) => {
  vias.map((via: { id: string }) => {
    map.setLayoutProperty(via.id, "visibility", "visible");
  });
};

const hideViasLayer = (map: any, vias: any) => {
  vias.map((via: { id: string }) => {
    map.setLayoutProperty(via.id, "visibility", "none");
  });
};

/* Create HTML to inner in Popup */
const getViasLegalizadasMetadatas = (metadatas: any) => {
  let body = ``;
  metadatas.map((meta: any) => {
    meta.property == ViasLegalizadasMetadatasTypes.AREA && meta.value != null
      ? (body += `<span><strong>ÁREA:</strong></span> <span>${meta.value}</span><br />`)
      : null;
    meta.property == ViasLegalizadasMetadatasTypes.DIRECCION &&
    meta.value != null
      ? (body += `<span><strong>DIRECCIÓN:</strong></span> <span>${meta.value}</span><br />`)
      : null;
  });
  return body;
};

/* Create HTML to inner in Popup */
const getViasMetadatas = (metadatas: any) => {
  let body = ``;
  metadatas.map((meta: any) => {
    meta.property == ViasMetadatasTypes.TIPOSUPCAL && meta.value != null
      ? (body += `<span><strong>TIPOSUPCAL:</strong></span> <span>${meta.value}</span><br />`)
      : null;
  });
  return body;
};

export {
  getVias,
  addViasLayer,
  addViasLegalizadasLayer,
  removeViasLayer,
  showViasLayer,
  hideViasLayer,
};
