class Sprite {
  constructor({ image, cols, rows, width, height }) {
    this.image = image;
    this.cols = cols;
    this.width = width;
    this.height = height;
  }

  getCanvas(index) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = this.width;
    canvas.height = this.height;

    const x = canvas.width / 2;
    const y = canvas.height / 2;
    context.drawImage(
      this.image, 
      (index % this.cols) * this.width, 
      Math.floor(index / this.cols) * this.height, 
      this.width, 
      this.height, 
      0, 
      0, 
      this.width, 
      this.height, 
    );
    return canvas;
  }
}

export default Sprite;