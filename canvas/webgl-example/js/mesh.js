class Mesh {
  constructor(gl, geometry, texture) {
    const vertexCount = geometry.vertexCount()
    this.positions = new VBO(gl, geometry.positions(), vertexCount);
    this.normals = new VBO(gl, geometry.normals(), vertexCount);
    this.uvs = new VBO(gl, geometry.uvs(), vertexCount);
    this.texture = texture;
    this.vertexCount = vertexCount;
    this.position = new Transformation();
    this.gl = gl;
  }

  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  draw(shaderProgram) {
    this.positions.bindToAttribute(shaderProgram.position);
    this.normals.bindToAttribute(shaderProgram.normal);
    this.uvs.bindToAttribute(shaderProgram.uv);
    this.position.sendToGpu(this.gl, shaderProgram.model);
    this.texture.use(shaderProgram.diffuse, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }
}

Mesh.load = (gl, modelUrl, textureUrl) => {
  const geometry = Geometry.loadOBJ(modelUrl);
  const texture = Texture.load(gl, textureUrl);
  return Promise
    .all([geometry, texture])
    .then(([geometry, texture]) => {
      return new Mesh(gl, geometry, texture);
    });
}
