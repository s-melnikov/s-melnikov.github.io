import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { adventureGemLocations } from '../game/board/adventureGemLocations';
import {
  boardGeometry,
  getBoardTextureCrop,
  imagePointToBoardWorld,
} from '../game/board/geometry';
import { BOARD_HEX_RADIUS, worldPointToBoardHex } from '../game/board/hexGrid';
import type { AdventureDeck } from '../game/types';
import {
  heroFigureCatalog,
  type HeroFigureDefinition,
  type TextureCrop,
} from '../game/heroes/figureCatalog';
import { createPlaceholderBoardTexture } from './createPlaceholderBoardTexture';

const TABLE_SIZE = { width: 42, depth: 30 } as const;
const BOARD_SIZE = boardGeometry.worldSize;
const BOARD_TEXTURE_PATH = 'assets/local/board/base-map-ru.jpeg';
const HERO_BASE_PATH = 'assets/local/figures/hero-base.stl';
const HERO_TEXTURE_PATH = 'assets/local/figures/heroes.png';
const HERO_WORLD_HEIGHT = 0.675;
const HERO_REFERENCE_SOURCE_HEIGHT = 32.631;
const HERO_BASE_INSET = 0.2;
const HERO_ART_SURFACE_OFFSET = 0.012;
const HERO_ROW_Z = 11.5;
const HERO_ROW_SPACING = 1.2;
const GEM_COLORS: Record<AdventureDeck, number> = {
  combat: 0xd46f24,
  exploration: 0x5d9a48,
  social: 0x80559b,
};

export class TabletopScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(40, 1, 0.1, 150);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly controls: OrbitControls;
  private readonly resizeObserver: ResizeObserver;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly adventureGems: THREE.Mesh[] = [];
  private boardMesh: THREE.Mesh | null = null;
  private readonly hexHighlight = this.createHexHighlight();
  private hoveredGem: THREE.Mesh | null = null;
  private pointerDownPosition: { x: number; y: number } | null = null;
  private frameId: number | null = null;
  private isDisposed = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene.background = new THREE.Color(0x14100d);
    this.scene.fog = new THREE.Fog(0x14100d, 35, 70);

    this.camera.position.set(0, 28, 33);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = 12;
    this.controls.maxDistance = 48;
    this.controls.minPolarAngle = THREE.MathUtils.degToRad(18);
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(75);
    this.controls.update();

    this.createLights();
    this.createTable();
    this.scene.add(this.hexHighlight);
    this.createPlaceholderComponents();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointerleave', this.handlePointerLeave);
    this.resize();
  }

  start(): void {
    if (this.frameId !== null) return;
    this.render();
  }

  dispose(): void {
    this.isDisposed = true;
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    this.frameId = null;
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    this.controls.dispose();
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose();
        }
        material.dispose();
      });
    });
    this.renderer.dispose();
  }

  private readonly render = (): void => {
    this.frameId = requestAnimationFrame(this.render);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    const width = Math.max(this.canvas.clientWidth, 1);
    const height = Math.max(this.canvas.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private createLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xffedc6, 0x24170f, 1.8));

    const keyLight = new THREE.DirectionalLight(0xffd9a0, 3.1);
    keyLight.position.set(-9, 20, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 16;
    keyLight.shadow.camera.bottom = -16;
    this.scene.add(keyLight);
  }

  private createTable(): void {
    const tabletop = new THREE.Mesh(
      new THREE.BoxGeometry(TABLE_SIZE.width, 0.8, TABLE_SIZE.depth),
      new THREE.MeshStandardMaterial({ color: 0x2c1b12, roughness: 0.82 }),
    );
    tabletop.position.y = -0.48;
    tabletop.receiveShadow = true;
    this.scene.add(tabletop);

    const boardTexture = createPlaceholderBoardTexture();
    boardTexture.colorSpace = THREE.SRGBColorSpace;
    boardTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const boardTopMaterial = new THREE.MeshStandardMaterial({
      map: boardTexture,
      roughness: 0.78,
    });

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(BOARD_SIZE.width, 0.24, BOARD_SIZE.depth),
      [
        new THREE.MeshStandardMaterial({ color: 0x382d21 }),
        new THREE.MeshStandardMaterial({ color: 0x382d21 }),
        boardTopMaterial,
        new THREE.MeshStandardMaterial({ color: 0x382d21 }),
        new THREE.MeshStandardMaterial({ color: 0x382d21 }),
        new THREE.MeshStandardMaterial({ color: 0x382d21 }),
      ],
    );
    board.position.y = 0.13;
    board.castShadow = true;
    board.receiveShadow = true;
    board.userData.assetId = 'board.base';
    this.boardMesh = board;
    this.scene.add(board);

    this.loadBoardTexture(boardTopMaterial, boardTexture);
  }

  private loadBoardTexture(
    material: THREE.MeshStandardMaterial,
    placeholder: THREE.Texture,
  ): void {
    const textureUrl = `${import.meta.env.BASE_URL}${BOARD_TEXTURE_PATH}`;
    new THREE.TextureLoader().load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        // The source scan contains an even white print margin. Crop it through
        // UV coordinates so the original local file remains untouched.
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const crop = getBoardTextureCrop();
        texture.offset.set(crop.offsetX, crop.offsetY);
        texture.repeat.set(crop.repeatX, crop.repeatY);
        texture.needsUpdate = true;

        material.map = texture;
        material.needsUpdate = true;
        placeholder.dispose();
      },
      undefined,
      () => {
        console.warn(`Board texture could not be loaded: ${textureUrl}`);
      },
    );
  }

  private createPlaceholderComponents(): void {
    adventureGemLocations.forEach((location) => {
      const worldPoint = imagePointToBoardWorld(location.imagePoint);
      const gem = this.createAdventureGem(location.type);
      gem.position.set(worldPoint.x, 0.4, worldPoint.z);
      gem.userData.assetId = `adventure-gem.${location.id}`;
      gem.userData.gemType = location.type;
      gem.userData.faceUp = true;
      this.adventureGems.push(gem);
      this.scene.add(gem);
    });

    const rowStartX = -((heroFigureCatalog.length - 1) * HERO_ROW_SPACING) / 2;
    heroFigureCatalog.forEach((figure, index) => {
      const position = new THREE.Vector3(
        rowStartX + index * HERO_ROW_SPACING,
        0.26,
        HERO_ROW_Z,
      );
      const heroPlaceholder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, HERO_WORLD_HEIGHT, 12),
        new THREE.MeshStandardMaterial({ color: 0x315f80, roughness: 0.46 }),
      );
      heroPlaceholder.position.copy(position).add(new THREE.Vector3(0, HERO_WORLD_HEIGHT / 2, 0));
      heroPlaceholder.castShadow = true;
      heroPlaceholder.userData.assetId = `hero.placeholder.${figure.id}`;
      this.scene.add(heroPlaceholder);
      this.loadHeroModel(heroPlaceholder, figure, position);
    });

    for (let index = 0; index < 5; index += 1) {
      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.62, 0.62),
        new THREE.MeshStandardMaterial({ color: 0x507245, roughness: 0.58 }),
      );
      die.position.set(-2 + index, 0.58, 9.2);
      die.rotation.set(index * 0.21, index * 0.34, index * 0.13);
      die.castShadow = true;
      die.userData.assetId = `terrain-die.${index}`;
      this.scene.add(die);
    }
  }

  private createAdventureGem(type: AdventureDeck): THREE.Mesh {
    const side = new THREE.MeshStandardMaterial({
      color: 0xb4944f,
      roughness: 0.42,
      metalness: 0.48,
    });
    const face = new THREE.MeshStandardMaterial({
      color: GEM_COLORS[type],
      roughness: 0.34,
      metalness: 0.22,
      emissive: 0x000000,
    });
    const back = new THREE.MeshStandardMaterial({
      color: 0x302b26,
      roughness: 0.7,
      emissive: 0x000000,
    });
    const gem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.29, 0.29, 0.16, 24),
      [side, face, back],
    );
    gem.castShadow = true;
    return gem;
  }

  private loadHeroModel(
    placeholder: THREE.Mesh,
    figure: HeroFigureDefinition,
    position: THREE.Vector3,
  ): void {
    const loader = new STLLoader();
    const figurePath = `assets/local/figures/${figure.id}.stl`;
    const figureUrl = `${import.meta.env.BASE_URL}${figurePath}`;
    const baseUrl = `${import.meta.env.BASE_URL}${HERO_BASE_PATH}`;

    Promise.all([loader.loadAsync(figureUrl), loader.loadAsync(baseUrl)])
      .then(([figureGeometry, baseGeometry]) => {
        if (this.isDisposed) {
          figureGeometry.dispose();
          baseGeometry.dispose();
          return;
        }

        // Rhino exported X as width, Y as thickness and Z as height.
        [figureGeometry, baseGeometry].forEach((geometry) => {
          geometry.rotateX(-Math.PI / 2);
          geometry.computeVertexNormals();
          geometry.computeBoundingBox();
        });
        const figureBounds = figureGeometry.boundingBox;
        const baseBounds = baseGeometry.boundingBox;
        if (!figureBounds || !baseBounds) {
          figureGeometry.dispose();
          baseGeometry.dispose();
          return;
        }

        const figureCenter = figureBounds.getCenter(new THREE.Vector3());
        const baseCenter = baseBounds.getCenter(new THREE.Vector3());
        figureGeometry.translate(
          -figureCenter.x,
          HERO_BASE_INSET - figureBounds.min.y,
          -figureCenter.z,
        );
        baseGeometry.translate(-baseCenter.x, -baseBounds.min.y, -baseCenter.z);
        figureGeometry.computeBoundingBox();
        baseGeometry.computeBoundingBox();
        const alignedFigureBounds = figureGeometry.boundingBox;
        if (!alignedFigureBounds) {
          figureGeometry.dispose();
          baseGeometry.dispose();
          return;
        }

        const group = new THREE.Group();
        const base = new THREE.Mesh(
          baseGeometry,
          new THREE.MeshStandardMaterial({
            color: 0x302a26,
            roughness: 0.72,
            metalness: 0.05,
          }),
        );
        base.castShadow = true;
        base.receiveShadow = true;
        base.userData.assetId = 'hero.base';
        group.add(base);

        const figureBacking = new THREE.Mesh(
          figureGeometry,
          new THREE.MeshStandardMaterial({
            color: 0x263b49,
            roughness: 0.62,
            metalness: 0.03,
          }),
        );
        figureBacking.castShadow = true;
        figureBacking.receiveShadow = true;
        figureBacking.userData.assetId = 'hero.figure-backing';
        group.add(figureBacking);

        this.loadHeroArt(group, alignedFigureBounds, figure);

        group.scale.setScalar(HERO_WORLD_HEIGHT / HERO_REFERENCE_SOURCE_HEIGHT);
        group.position.copy(position);
        group.userData.assetId = `hero.standee.${figure.id}`;
        group.userData.modelGrid = figure.modelGrid;
        this.scene.add(group);

        this.scene.remove(placeholder);
        placeholder.geometry.dispose();
        const materials = Array.isArray(placeholder.material)
          ? placeholder.material
          : [placeholder.material];
        materials.forEach((material) => material.dispose());
      })
      .catch((error: unknown) => {
        console.warn(`Hero model could not be loaded: ${String(error)}`);
      });
  }

  private loadHeroArt(
    group: THREE.Group,
    figureBounds: THREE.Box3,
    figure: HeroFigureDefinition,
  ): void {
    const textureUrl = `${import.meta.env.BASE_URL}${HERO_TEXTURE_PATH}`;
    new THREE.TextureLoader().load(
      textureUrl,
      (sourceTexture) => {
        if (this.isDisposed) {
          sourceTexture.dispose();
          return;
        }

        const source = sourceTexture.image as CanvasImageSource;
        const frontTexture = this.createHeroArtTexture(source, figure.art.front.crop);
        const backTexture = this.createHeroArtTexture(source, figure.art.back.crop);
        sourceTexture.dispose();

        const width = figureBounds.max.x - figureBounds.min.x;
        const height = figureBounds.max.y - figureBounds.min.y;
        const center = figureBounds.getCenter(new THREE.Vector3());
        const geometry = new THREE.PlaneGeometry(width, height);
        const createMaterial = (map: THREE.Texture): THREE.MeshBasicMaterial =>
          new THREE.MeshBasicMaterial({
            map,
            transparent: true,
            alphaTest: 0.08,
            side: THREE.FrontSide,
            toneMapped: false,
          });

        const front = new THREE.Mesh(geometry, createMaterial(frontTexture));
        front.position.set(
          center.x,
          center.y,
          figureBounds.max.z + HERO_ART_SURFACE_OFFSET,
        );
        front.renderOrder = 1;
        front.userData.assetId = `hero.figure-art.front.${figure.id}`;
        front.userData.textureGrid = figure.art.front.grid;
        group.add(front);

        const back = new THREE.Mesh(geometry.clone(), createMaterial(backTexture));
        back.position.set(
          center.x,
          center.y,
          figureBounds.min.z - HERO_ART_SURFACE_OFFSET,
        );
        back.rotation.y = Math.PI;
        back.renderOrder = 1;
        back.userData.assetId = `hero.figure-art.back.${figure.id}`;
        back.userData.textureGrid = figure.art.back.grid;
        group.add(back);
      },
      undefined,
      () => {
        console.warn(`Hero texture could not be loaded: ${textureUrl}`);
      },
    );
  }

  private createHeroArtTexture(
    source: CanvasImageSource,
    crop: TextureCrop,
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas is unavailable.');

    context.drawImage(
      source,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  private readonly handlePointerMove = (event: PointerEvent): void => {
    this.updateHexHighlight(event);
    const gem = this.pickAdventureGem(event);
    if (gem === this.hoveredGem) return;
    this.setGemHighlighted(this.hoveredGem, false);
    this.hoveredGem = gem;
    this.setGemHighlighted(this.hoveredGem, true);
    this.canvas.classList.toggle('is-interactive', gem !== null);
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.button === 0) {
      this.pointerDownPosition = { x: event.clientX, y: event.clientY };
    }
    if (event.button === 0 || event.button === 2) {
      this.canvas.classList.add('is-dragging');
    }
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    this.canvas.classList.remove('is-dragging');
    if (event.button !== 0 || !this.pointerDownPosition) return;
    const distance = Math.hypot(
      event.clientX - this.pointerDownPosition.x,
      event.clientY - this.pointerDownPosition.y,
    );
    this.pointerDownPosition = null;
    if (distance > 5) return;

    const gem = this.pickAdventureGem(event);
    if (!gem) return;
    const isFaceUp = gem.userData.faceUp === true;
    gem.userData.faceUp = !isFaceUp;
    gem.rotation.x = isFaceUp ? Math.PI : 0;
  };

  private readonly handlePointerLeave = (): void => {
    this.pointerDownPosition = null;
    this.setGemHighlighted(this.hoveredGem, false);
    this.hoveredGem = null;
    this.hexHighlight.visible = false;
    this.canvas.classList.remove('is-interactive', 'is-dragging');
  };

  private pickAdventureGem(event: PointerEvent): THREE.Mesh | null {
    this.updatePointerRay(event);
    const [intersection] = this.raycaster.intersectObjects(this.adventureGems, false);
    return intersection?.object instanceof THREE.Mesh ? intersection.object : null;
  }

  private setGemHighlighted(gem: THREE.Mesh | null, highlighted: boolean): void {
    if (!gem) return;
    const materials = Array.isArray(gem.material) ? gem.material : [gem.material];
    materials.forEach((material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.emissive.setHex(highlighted ? 0x55401c : 0x000000);
      }
    });
  }

  private createHexHighlight(): THREE.Group {
    const group = new THREE.Group();
    const fill = new THREE.Mesh(
      new THREE.CircleGeometry(BOARD_HEX_RADIUS * 0.96, 6),
      new THREE.MeshBasicMaterial({
        color: 0xffd66e,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    fill.rotation.x = -Math.PI / 2;
    group.add(fill);

    const borderPoints: THREE.Vector3[] = [];
    for (let corner = 0; corner < 6; corner += 1) {
      const angle = (corner * Math.PI) / 3;
      borderPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * BOARD_HEX_RADIUS * 0.96,
          0,
          Math.sin(angle) * BOARD_HEX_RADIUS * 0.96,
        ),
      );
    }
    const border = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(borderPoints),
      new THREE.LineBasicMaterial({ color: 0xffdc79, transparent: true, opacity: 0.9 }),
    );
    border.position.y = 0.012;
    group.add(border);
    group.position.y = 0.265;
    group.visible = false;
    group.renderOrder = 2;
    return group;
  }

  private updateHexHighlight(event: PointerEvent): void {
    if (!this.boardMesh) return;
    this.updatePointerRay(event);
    const [intersection] = this.raycaster.intersectObject(this.boardMesh, false);
    if (!intersection) {
      this.hexHighlight.visible = false;
      return;
    }

    const hex = worldPointToBoardHex({ x: intersection.point.x, z: intersection.point.z });
    if (!hex) {
      this.hexHighlight.visible = false;
      return;
    }

    this.hexHighlight.position.x = hex.center.x;
    this.hexHighlight.position.z = hex.center.z;
    this.hexHighlight.userData.hexId = hex.id;
    this.hexHighlight.userData.coordinate = hex.coordinate;
    this.hexHighlight.visible = true;
  }

  private updatePointerRay(event: PointerEvent): void {
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }
}
