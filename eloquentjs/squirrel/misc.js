
/*** *** *** *** ***/

function randomPointOnCircle(radius) {
  var angle = Math.random() * 2 * Math.PI;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  }
}

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

canvas.width = 200;
canvas.height = 200;
document.body.appendChild(canvas);

function loop() {
  var point = randomPointOnCircle(80);
  context.fillRect(point.x + 100, point.y + 100, 1, 1);
  requestAnimationFrame(loop)
}

loop();

/*** *** *** *** ***/