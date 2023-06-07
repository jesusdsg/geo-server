import mapboxgl from "mapbox-gl";
import { urbanizacionesStore } from "@/stores/urbanizaciones";
import { UrbanizacionesMetadatasTypes } from "@/utils/constants";

const urbanizaciones = urbanizacionesStore();

const getUrbanizaciones = async (baseURL: string) => {
  await useFetch(
    `${baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/urbanizaciones/`,
    {
      async onResponse({ request, response, options }) {
        urbanizaciones.setUrbanizaciones(response._data);
      },
    }
  );
};

const addUrbanizacionesLayer = (map: any, urbanizaciones: any) => {
  urbanizaciones.map((urbanizacion: any) => {
    try {
      map.addSource(urbanizacion.id, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: urbanizacion.geo,
        },
      });

      map.addLayer({
        id: urbanizacion.id,
        type: "fill",
        source: urbanizacion.id, // reference the data source
        layout: {
          visibility: "none",
        },
        paint: {
          "fill-color": "red", // blue color fill
          "fill-opacity": 0.2,
        },
      });

      const metadatasHTML = getMetadatas(urbanizacion.metadatas);
      /* Map on click */
      map.on("click", [urbanizacion.id], (e: any) => {
        new mapboxgl.Popup({ className: "map-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${metadatasHTML}</div>`)
          .addTo(map);
      });
    } catch (error) {}
  });
};

const showUrbanizaciones = (map: any, urbanizaciones: any) => {
  urbanizaciones.map((urbanizacion: any) => {
    map.setLayoutProperty(urbanizacion.id, "visibility", "visible");
  });
};

const hideUrbanizaciones = (map: any, urbanizaciones: any) => {
  urbanizaciones.map((urbanizacion: any) => {
    map.setLayoutProperty(urbanizacion.id, "visibility", "none");
  });
};

/* Create HTML to inner in Popup */
const getMetadatas = (metadatas: any) => {
  let body = ``;
  metadatas.map((meta: any) => {
    meta.property == UrbanizacionesMetadatasTypes.URBANIZACION
      ? (body += `<span><strong>NOMBRE:</strong></span> <span>${meta.value}</span><br />`)
      : null;
  });
  return body;
};

export {
  getUrbanizaciones,
  addUrbanizacionesLayer,
  showUrbanizaciones,
  hideUrbanizaciones,
};
