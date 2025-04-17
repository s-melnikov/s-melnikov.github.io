const settings = JSON.parse(localStorage.pnp
  || '{"width":320,"height":320,"marginX":0,"marginY":0,"strokeStyle":"#f00"}');

const canvas = document.querySelector("canvas");
const canvasBuffer = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const buffer = canvasBuffer.getContext("2d");

let image = null;

function render() {
  const scale = 0.5;

  canvas.width = image.width * scale;
  canvas.height = image.height * scale;

  ctx.scale(scale, scale);

  ctx.drawImage(
    image, 0, 0,
    canvas.width / scale,
    canvas.height / scale,
    0, 0,
    canvas.width / scale,
    canvas.height / scale
  );

  const rowLength = Math.floor(image.width / settings.width);
  const rowsCount = Math.floor(image.height / settings.height);
  canvasBuffer.width = settings.width;
  canvasBuffer.height = settings.height;
  ctx.strokeStyle = settings.strokeStyle;

  for (let y = 0; y < rowsCount; y++) {
    for (let x = 0; x < rowLength; x++) {
      const n = rowLength * y + x + 1;
      if (settings.from && settings.from > n) continue;
      if (settings.to && n > settings.to) continue;
      drawRect(
        image,
        x * settings.width + settings.marginX,
        y * settings.height + settings.marginY,
        n
      );
    }
  }
  ctx.stroke();
};

function drawRect(i, x, y, n) {
  ctx.rect(x, y, settings.width, settings.height);
}

function saveImage(i, x, y, n, zip, cb) {
  buffer.drawImage(i, x, y, settings.width, settings.height, 0, 0, settings.width, settings.height);
  canvasBuffer.toBlob((blob) => {
    zip.file(`sprite_${String(n).padStart(3, 0)}.png`, blob);
    cb();
  });
}

function save() {
  const zip = new JSZip();
  const rowLength = Math.floor(image.width / settings.width);
  const rowsCount = Math.floor(image.height / settings.height);
  canvasBuffer.width = settings.width;
  canvasBuffer.height = settings.height;
  ctx.strokeStyle = settings.strokeStyle;

  let count = 0;

  for (let y = 0; y < rowsCount; y++) {
    for (let x = 0; x < rowLength; x++) {
      const n = rowLength * y + x + 1;
      if (settings.from && settings.from > n) continue;
      if (settings.to && n > settings.to) continue;
      count++;
      saveImage(
        image,
        x * settings.width + settings.marginX,
        y * settings.height + settings.marginY,
        n,
        zip,
        () => {
          count--;
          if (!count) {
            zip.generateAsync({ type: "blob" })
              .then(function(content) {
                saveAs(content, "sprites.zip");
              });
          }
        }
      );
    }
  }
};

function loadImage(src) {
  const img = document.createElement("img");
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = src;
  });
}

document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
});
document.body.addEventListener("drop", async(event) => {
  event.preventDefault();
  image = await loadImage(URL.createObjectURL(event.dataTransfer.files[0]));
  render();
});

function handleInputChange(event) {
  const { name, value, type } = event.target;
  settings[name] = (type === "number") ? (Number(value) || 0) : value;
  localStorage.pnp = JSON.stringify(settings);
  render();
}

document.querySelectorAll("#settings input").forEach((el) => {
  el.value = settings[el.name];
  el.addEventListener("change", handleInputChange);
});

window.save = save;
