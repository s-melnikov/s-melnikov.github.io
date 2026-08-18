import './styles.css';
import { TabletopScene } from './tabletop/TabletopScene';

const cursorPath = (filename: string): string =>
  `${import.meta.env.BASE_URL}assets/local/cursors/${filename}`;
const rootStyle = document.documentElement.style;
rootStyle.setProperty(
  '--cursor-default',
  `url("${cursorPath('fantasy-sword.png')}") 1 1, default`,
);
rootStyle.setProperty(
  '--cursor-open',
  `url("${cursorPath('fantasy-hand-open.png')}") 1 1, grab`,
);
rootStyle.setProperty(
  '--cursor-closed',
  `url("${cursorPath('fantasy-hand-closed.png')}") 1 1, grabbing`,
);
rootStyle.setProperty(
  '--cursor-point',
  `url("${cursorPath('fantasy-sword.png')}") 1 1, pointer`,
);

const canvas = document.querySelector<HTMLCanvasElement>('#tabletop');

if (!canvas) {
  throw new Error('Canvas #tabletop was not found.');
}

const tabletop = new TabletopScene(canvas);
tabletop.start();

window.addEventListener('beforeunload', () => tabletop.dispose(), { once: true });
