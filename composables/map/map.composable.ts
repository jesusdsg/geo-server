import mapboxgl from "mapbox-gl";

const addMainSourceLayer = (map: any, coordinates: any) => {
  // Add a data source containing GeoJSON data.
  map.addSource("maine", {
    type: "geojson",
    data: {
      type: "Feature",
      //geometry,
      geometry: {
        type: "Polygon",
        coordinates: coordinates.value,
      },
    },
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    id: "maine",
    type: "fill",
    source: "maine", // reference the data source
    layout: {},
    paint: {
      "fill-color": "#0080ff", // blue color fill
      "fill-opacity": 0,
    },
  });
  // Add a black outline around the polygon.
  map.addLayer({
    id: "outline",
    type: "line",
    source: "maine",
    layout: {},
    paint: {
      "line-color": "#838383",
      "line-width": 2,
    },
  });
};

const addMainControls = (map: any) => {
  // Add zoom and rotation controls to the map.
  map.addControl(
    new mapboxgl.NavigationControl({
      showCompass: false,
    }),
    "bottom-right"
  );

  /* map.on("mouseenter", "states-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  }); */
};

export { addMainSourceLayer, addMainControls };
