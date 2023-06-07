import mapboxgl from "mapbox-gl";
import { barriosStore } from "@/stores/barrios";
import centroid from "@turf/centroid";
const barriosState = barriosStore();

const getBarrios = async (baseURL: string) => {
  await useFetch(
    `${baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/barrios/`,
    {
      async onResponse({ request, response, options }) {
        /* Discard barrios with not limite */
        const barrios = response._data.filter(
          (barrio: any) => barrio.limite != null
        );
        barriosState.setBarrios(barrios);
      },
      onResponseError({ request, response, options }) {},
    }
  );
};

/**
 * Add Barrios layer on the map
 * @param map
 * @param barrios
 */
const addBarriosLayer = (map: any, barrios: any) => {
  const newBarrios = barrios.filter((x: any) => x.limite != null);
  newBarrios.map((barrio: any) => {
    try {
      /* Init feature */
      let feature: any = {
        type: "Feature",
        properties: {
          name: barrio.id,
        },
        geometry: barrio.limite,
      };

      map.addSource(barrio.id, {
        type: "geojson",
        data: feature,
      });

      map.addLayer({
        id: barrio.id,
        type: "line",
        source: barrio.id, // reference the data source
        layout: {
          visibility: "none",
        },
        paint: {
          "line-color": "#2e4e5d",
          "line-width": 1,
        },
      });

      /* Getting the center by feature */
      let centroidPt: any = centroid(feature);
      centroidPt.properties.title = barrio.name;

      // Add the label point source
      map.addSource(`label-${barrio.id}`, {
        type: "geojson",
        data: centroidPt,
      });

      // Add the label style
      map.addLayer({
        id: `label-style-${barrio.id}`,
        type: "symbol",
        source: `label-${barrio.id}`,
        layout: {
          "text-field": barrio.name,
          "text-size": 10,
        },
        paint: {
          "text-color": "#2e4e5d",
        },
      });

      /* Map on click */
      map.on("click", [barrio.id], (e: any) => {
        new mapboxgl.Popup({ className: "map-popup" })
          .setLngLat(e.lngLat)
          .setHTML(`<div>${barrio.name}</div>`)
          .addTo(map);
      });
    } catch (error) {}
  });
};

const addSelectedBarriosLayer = (map: any, barrios: any) => {
  const selected = barrios.filter(
    (barrio: { checked: boolean }) => barrio.checked
  );
  removeBarriosLayer(map, barrios);
  addBarriosLayer(map, selected);
};

const showSelectedBarriosLayer = (map: any, barrios: any) => {
  barrios.map((barrio: { id: string; checked: boolean }) => {
    if (barrio.checked) {
      map.setLayoutProperty(barrio.id, "visibility", "visible");
    } else {
      map.setLayoutProperty(barrio.id, "visibility", "none");
    }
  });
};

const hideBarriosLayer = (map: any, barrios: any) => {
  const newBarrios = barrios.filter((x: any) => x.limite != null);
  newBarrios.map((barrio: any) => {
    try {
      map.setLayoutProperty(barrio.id, "visibility", "none");
    } catch (error) {}
  });
};

/**
 * Removing barrios layer from the map
 * @param map
 * @param barrios
 */
const removeBarriosLayer = (map: any, barrios: any) => {
  const newBarrios = barrios.filter((x: any) => x.limite != null);
  newBarrios.map((barrio: any) => {
    try {
      map.removeLayer(barrio.id);
      map.removeSource(barrio.id);
    } catch (error) {}
  });
};

export {
  getBarrios,
  addSelectedBarriosLayer,
  addBarriosLayer,
  removeBarriosLayer,
  showSelectedBarriosLayer,
  hideBarriosLayer,
};
