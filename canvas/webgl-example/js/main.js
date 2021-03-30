const canvas = document.querySelector("canvas");
const renderer = new Renderer(canvas);
renderer.setClearColor(100, 149, 237);
const gl = renderer.getContext();
const objects = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

Mesh
  .load(gl, '/assets/sphere.obj', '/assets/diffuse.png')
  .then((mesh) => {
    objects.push(mesh);
  });

ShaderProgram
  .load(gl, '/shaders/basic.vert', '/shaders/basic.frag')
  .then((shader) => {
    renderer.setShader(shader);
  });

const camera = new Camera();
camera.setOrthographic(32, 16, 10);
const light = new Light();


const loop = () => {
  renderer.render(camera, light, objects);
  camera.position = camera.position.rotateY(Math.PI / 60);
  requestAnimationFrame(loop);
};

loop();
