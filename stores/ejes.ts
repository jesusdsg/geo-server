import { defineStore } from "pinia";

const initialState: any = [];

export const ejesVialesStore = defineStore("ejes", {
  state: () => ({
    data: initialState,
    tipos: [
      {
        id: 1,
        value: "Adoquin",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 2,
        value: "Destapado",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 3,
        value: "Empedrado",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 4,
        value: "Rigido",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 5,
        value: "Flexible",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 6,
        value: "Asfaltico",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
      {
        id: 7,
        value: "Afirmado",
        checked: false,
        toggled: false,
        color: getHexRandomColor(),
      },
    ],
  }),
  actions: {
    setEjesViales(ejes: any) {
      this.data = ejes;
    } /* Select barrios in checkbox */,
    selectTipo(id: string) {
      const exists = this.tipos.find((x: any) => x.id == id);
      if (exists) {
        exists.checked = true;
      }
    },
    /* unselect barrios in checkbox */
    unselectTipo(id: number) {
      const exists = this.tipos.find((x: any) => x.id == id);
      if (exists) {
        exists.checked = false;
      }
    },
  },
});
