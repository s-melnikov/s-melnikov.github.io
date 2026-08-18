import * as THREE from 'three';

const TEXTURE_WIDTH = 1600;
const TEXTURE_HEIGHT = 1200;
const HEX_RADIUS = 82;

export function createPlaceholderBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas is unavailable.');

  const background = context.createRadialGradient(800, 560, 60, 800, 560, 900);
  background.addColorStop(0, '#6f7c46');
  background.addColorStop(0.52, '#485c36');
  background.addColorStop(1, '#273927');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 2;
  context.strokeStyle = 'rgba(222, 201, 139, 0.23)';
  for (let row = -1; row < 10; row += 1) {
    for (let column = -1; column < 13; column += 1) {
      const x = column * HEX_RADIUS * 1.5 + (row % 2 === 0 ? 0 : HEX_RADIUS * 0.75);
      const y = row * Math.sqrt(3) * HEX_RADIUS + 20;
      drawHex(context, x, y, HEX_RADIUS);
    }
  }

  context.fillStyle = 'rgba(242, 221, 165, 0.78)';
  context.textAlign = 'center';
  context.font = 'small-caps 700 64px Georgia';
  context.fillText('RUNBOUND — ASSETS PENDING', 800, 590);
  context.font = '32px Georgia';
  context.fillText('placeholder board', 800, 642);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function drawHex(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
): void {
  context.beginPath();
  for (let side = 0; side < 6; side += 1) {
    const angle = (Math.PI / 3) * side;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    if (side === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.stroke();
}
