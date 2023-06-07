import { defineStore } from "pinia";

const initialState: any = [
  { id: 1, name: "Barrios", icon: "uil:house-user", checked: false },
  { id: 2, name: "Urbanizaciones", icon: "uil:building", checked: false },
  { id: 3, name: "Predios", icon: "uil:pathfinder-unite", checked: false },
  { id: 4, name: "Vias", icon: "uil:sign-alt", checked: false },
  {
    id: 5,
    name: "Vias legalizadas",
    icon: "uil:sign-left",
    checked: false,
  },
  {
    id: 6,
    name: "Señalización vial",
    icon: "uil:exclamation-triangle",
    checked: false,
  },
  { id: 7, name: "Ejes viales", icon: "uil:line-alt", checked: false },
  { id: 8, name: "Vertices", icon: "uil:life-ring", checked: false },
  { id: 9, name: "Matrices", icon: "uil:table", checked: false },
];

export const layersStore = defineStore("layers", {
  state: () => ({
    selected: initialState,
  }),
  actions: {
    selectLayer(layer: any) {
      const selected = this.selected.filter((x: any) => x.checked);
      if (selected.length < 4) {
        const exists = this.selected.find((x: any) => x.id == layer.id);
        if (exists) {
          exists.checked = true;
        }
      } else {
        alert("Máximo 4 capas seleccionadas");
      }
    },
    unselectLayer(layer: any) {
      const exists = this.selected.find((x: any) => x.id == layer.id);
      if (exists) {
        exists.checked = false;
      }
    },
    /* Push the selected into Layer */
    /* addSelectedLayer(layer: any) {
      const exists = this.selected.find((x: any) => x.id == layer.id);
      if (!exists) {
        this.selected.push(layer);
      }
    }, */
    /* Remove */
    /* removeSelectedLayer(layer: any) {
      const res = this.selected.filter((x: any) => x.id != layer.id);
      if (res) {
        this.selected = res;
      }
    }, */
  },
});
