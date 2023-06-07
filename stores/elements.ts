import { defineStore } from "pinia";

const spinnerState: boolean = false;

export const elementsStore = defineStore("elements", {
  state: () => ({
    spinner: spinnerState,
  }),
  actions: {
    showSpinner() {
      this.spinner = true;
    },
    hideSpinner() {
      this.spinner = false;
    },
  },
});
