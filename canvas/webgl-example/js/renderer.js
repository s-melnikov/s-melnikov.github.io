class Renderer {
  constructor(canvas) {
    const gl = canvas.getContext("webgl");
    gl.enable(gl.DEPTH_TEST);
    this.gl = gl;
    this.shader = null;
  }

  setClearColor(red, green, blue) {
    this.gl.clearColor(red / 255, green / 255, blue / 255, 1);
  }

  getContext() {
    return this.gl;
  }

  setShader(shader) {
    this.shader = shader;
  }

  render(camera, light, objects) {
    this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!this.shader) return;
    this.shader.use();
    light.use(this.shader);
    camera.use(this.shader);
    objects.forEach((mesh) => {
      mesh.draw(this.shader);
    });
  }
}
