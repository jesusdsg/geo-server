import mapboxgl from "mapbox-gl";
import { MetadatasTypes } from "@/utils/constants";
import centroid from "@turf/centroid";

const addFranjasVialesLayer = (map: any, franjas: any) => {
  franjas.map((franja: any) => {
    try {
      /* Init feature */
      let feature: any = {
        type: "Feature",
        properties: {
          name: franja.id,
        },
        geometry: franja.geo,
      };

      map.addSource(franja.id, {
        type: "geojson",
        data: feature,
      });

      map.addLayer({
        id: franja.id,
        type: "fill",
        source: franja.id, // reference the data source
        layout: {
          //visibility: "none",
        },
        paint: {
          "fill-color": getRandomColor(), // blue color fill
          "fill-opacity": 0.6,
        },
      });

      /* Get center from the layer */
      let centroidPt: any = centroid(feature);

      /* Center on load */
      map.on("idle", [franja.id], (e: any) => {
        map.flyTo({
          //center: centroidPt.geometry.coordinates,
          //zoom: 16,
        });
      });

      const metadatasHTML = getMetadatas(franja.metadatas);

      /* Map on click */
      map.on("click", [franja.id], (e: any) => {
        new mapboxgl.Popup({ className: "map-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${metadatasHTML}</div>`)
          .addTo(map);
      });
    } catch (error) {}
  });
};

/* Create HTML to inner in Popup */
const getMetadatas = (metadatas: any) => {
  let body = ``;
  metadatas.map((meta: any) => {
    meta.property == MetadatasTypes.ESTADO && meta.value
      ? (body += `<span><strong>${meta.property}:</strong></span> <span>${meta.value}</span><br />`)
      : null;
    meta.property == MetadatasTypes.UBICACION && meta.value
      ? (body += `<span><strong>${meta.property}:</strong></span> <span>${meta.value}</span><br />`)
      : null;
    meta.property == MetadatasTypes.VIA && meta.value
      ? (body += `<span><strong>${meta.property}:</strong></span> <span>${meta.value}</span><br />`)
      : null;
    meta.property == MetadatasTypes.TIPOSUPCAL && meta.value
      ? (body += `<span><strong>${meta.property}:</strong></span> <span>${meta.value}</span><br />`)
      : null;
  });
  return body;
};

const removeFranjasVialesLayer = (map: any, franjas: any) => {
  franjas.map((franja: any) => {
    try {
      map.removeLayer(franja.id);
      map.removeSource(franja.id);
    } catch (error) {}
  });
};

const showFranjasVialesLayer = (map: any, franjas: any) => {
  franjas.map((franja: any) => {
    map.setLayoutProperty(franja.id, "visibility", "visible");
  });
};

export { addFranjasVialesLayer, removeFranjasVialesLayer };
