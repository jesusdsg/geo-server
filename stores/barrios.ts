import { defineStore } from "pinia";

const initialState: any = [];

export const barriosStore = defineStore("barrios", {
  state: () => ({
    data: initialState,
    current: initialState,
  }),
  actions: {
    /* Create properties for each Barrio */
    setBarrios(barrios: any) {
      this.data = barrios;
      this.data.map((barrio: any) => {
        /* set custom properties */
        barrio.checked = true;
        barrio.color = getRandomColor();
        barrio.toggled = false;
        barrio.properties = [
          { id: 1, name: "Franjas", toggled: false },
          { id: 2, name: "Vertices", toggled: false },
        ];
      });
    },
    /* Toggle current barrio properties */
    toggleBarrios(barrio: any) {
      const exists = this.data.find((x: { id: string }) => x.id == barrio.id);
      exists ? (exists.toggled = !exists.toggled) : null;
      exists.toggled ? (this.current = barrio) : (this.current = []);
      const diff = this.data.filter((x: { id: string }) => x.id != barrio.id);
      diff.map((diffBarrio: any) => {
        diffBarrio.toggled = false;
      });
    },
    /* Toggle properties of the current barrio */
    toggleProperties(idBarrio: string, idProperty: number) {
      const exists = this.data.find((x: { id: string }) => x.id == idBarrio);
      if (exists) {
        const property = exists.properties.find(
          (p: { id: number }) => p.id == idProperty
        );
        property ? (property.toggled = !property.toggled) : null;
      }
    },
    /* Select barrios in checkbox */
    selectBarrio(id: string) {
      const exists = this.data.find((x: any) => x.id == id);
      if (exists) {
        exists.checked = true;
      }
    },
    /* unselect barrios in checkbox */
    unselectBarrio(id: number) {
      const exists = this.data.find((x: any) => x.id == id);
      if (exists) {
        exists.checked = false;
      }
    },
  },
});
