import { defineStore } from "pinia";

const initialState: any = [];

export const viasStore = defineStore("vias", {
  state: () => ({
    data: initialState,
    legalizadas: initialState,
  }),
  actions: {
    setVias(vias: any) {
      const legalizadas = vias.filter(
        (x: { es_legalizada: boolean }) => x.es_legalizada
      );
      const no_legalizadas = vias.filter(
        (x: { es_legalizada: boolean }) => !x.es_legalizada
      );
      this.legalizadas = legalizadas;
      this.data = no_legalizadas;
    },
  },
});
