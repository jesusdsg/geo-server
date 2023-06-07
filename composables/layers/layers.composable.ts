const getSelectedLayerByName = (name: string, layers: any) => {
  return layers.find(
    (x: { name: string; checked: boolean }) =>
      x.name.toLocaleLowerCase() == name.toLocaleLowerCase() && x.checked
  );
};

export { getSelectedLayerByName };
