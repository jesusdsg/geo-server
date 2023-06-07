const config = useRuntimeConfig();

import { ejesVialesStore } from "@/stores/ejes";
import data from "@/geo/matrices.json" assert { type: "json" };

const getBarrios = async () => {
  const { data, error, execute, pending, refresh } = await useFetch(
    `${config.baseURL}/municipios/f0eaa355-732f-41e3-bd3d-92eff4e29479/matrices/`,
    {
      onRequest({ request, options }) {},
      onRequestError({ request, options, error }) {},
      async onResponse({ request, response, options }) {},
      onResponseError({ request, response, options }) {},
    }
  );
};
