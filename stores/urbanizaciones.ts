import { defineStore } from "pinia";

const initialState: any = [];

export const urbanizacionesStore = defineStore("urbanizaciones", {
  state: () => ({
    data: initialState,
  }),
  actions: {
    setUrbanizaciones(urbanizaciones: any) {
      this.data = urbanizaciones;
    },
  },
});
