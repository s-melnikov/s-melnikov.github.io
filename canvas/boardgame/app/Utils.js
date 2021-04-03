const Utils = {
  loadImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = src;
    });
  },
  loadJson(src) {
    return fetch(src).then((r) => r.json());
  }
};

export default Utils;