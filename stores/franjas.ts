import { defineStore } from "pinia";

const initialState: any = [];

export const franjasStore = defineStore("franjas", {
  state: () => ({
    data: initialState,
    recent: initialState,
  }),
  actions: {
    setFranjas(franjas: any) {
      this.data = franjas;
    },
    setRecent(franjas: any) {
      this.recent = franjas;
    },
  },
});
