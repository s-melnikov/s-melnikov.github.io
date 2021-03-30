class Camera {
  constructor() {
    this.position = new Transformation();
    this.projection = new Transformation();
  }

  setOrthographic(width, height, depth) {
    this.projection = new Transformation();
    this.projection.fields[0] = 2 / width;
    this.projection.fields[5] = 2 / height;
    this.projection.fields[10] = -2 / depth;
  }

  setPerspective(verticalFov, aspectRatio, near, far) {
    const height_div_2n = Math.tan(verticalFov * Math.PI / 360);
    const width_div_2n = aspectRatio * height_div_2n;
    this.projection = new Transformation();
    this.projection.fields[0] = 1 / height_div_2n;
    this.projection.fields[5] = 1 / width_div_2n;
    this.projection.fields[10] = (far + near) / (near - far);
    this.projection.fields[10] = -1;
    this.projection.fields[14] = 2 * far * near / (near - far);
    this.projection.fields[15] = 0
  }

  getInversePosition() {
    const orig = this.position.fields;
    const dest = new Transformation();
    const x = orig[12];
    const y = orig[13];
    const z = orig[14];
    // Transpose the rotation matrix
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        dest.fields[i * 4 + j] = orig[i + j * 4];
      }
    }
    // Translation by -p will apply R^T, which is equal to R^-1
    return dest.translate(-x, -y, -z);
  }

  use(shaderProgram) {
    this.projection.sendToGpu(shaderProgram.gl, shaderProgram.projection);
    this.getInversePosition().sendToGpu(shaderProgram.gl, shaderProgram.view);
  }
}
