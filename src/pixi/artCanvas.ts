import { Application, BlurFilter, Filter } from "pixi.js";
import { Viewport } from "pixi-viewport";

import { BloomFilter, ShockwaveFilter, SimplexNoiseFilter } from "pixi-filters";

interface ArtCanvasConfig {
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  background?: string;
  zoom?: boolean;
}

// ArtCanvas object which is the Background of an Art Piece
// Will be used for different type of art (spinArt, growArt, and others to be developed)
export class ArtCanvas {
  public app: Application;
  public viewport: Viewport | null;
  private zoom: boolean;

  private constructor() {
    this.app = new Application();
    this.viewport = null;
    this.zoom = false;
  }

  private addZoom(width: number, height: number, zoom: boolean) {
    this.zoom = zoom;
    if (this.viewport) this.viewport.destroy();

    this.viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      events: this.app.renderer.events,
    });
    if (zoom) {
      this.viewport.drag().pinch().wheel();
    }
    this.app.stage.addChild(this.viewport);
  }

  // Creates ArtCanvas object
  public static async create({
    canvas,
    height,
    width,
    background,
    zoom,
  }: ArtCanvasConfig): Promise<ArtCanvas> {
    const instance = new ArtCanvas();
    instance.app = new Application();
    await instance.app.init({
      canvas: canvas,
      background: background ?? "black",
      width: width,
      height: height,
    });

    instance.addZoom(width, height, zoom ?? false);

    instance.app.stage.filters = [];

    return instance;
  }

  refreshZoom() {
    if (!this.viewport) return;

    this.viewport.setZoom(1);
    this.viewport.moveCenter(0, 0);
  }

  addChild(child: any) {
    if (!this.viewport) return;
    this.viewport.addChild(child);
  }

  removeChild(child: any) {
    if (!this.viewport) return;
    this.viewport.removeChild(child);
  }

  // For adding filters without reconstruction
  addFilters(filters: string[]) {
    const curFils = this.app.stage.filters;
    const curFilsArr: Filter[] = Array.isArray(curFils)
      ? [...curFils]
      : curFils
      ? [curFils]
      : [];
    for (const filter of filters) {
      switch (filter) {
        case "blur": {
          if (!curFilsArr.some((f) => f instanceof BlurFilter)) {
            curFilsArr.push(new BlurFilter());
          }
          break;
        }
        case "bloom": {
          if (!curFilsArr.some((f) => f instanceof BloomFilter)) {
            curFilsArr.push(new BloomFilter());
          }
          break;
        }
        case "shockwave": {
          if (!curFilsArr.some((f) => f instanceof ShockwaveFilter)) {
            curFilsArr.push(new ShockwaveFilter());
          }
          break;
        }
        case "noise": {
          if (!curFilsArr.some((f) => f instanceof SimplexNoiseFilter)) {
            curFilsArr.push(new SimplexNoiseFilter());
          }
          break;
        }
      }
    }
    this.app.stage.filters = curFilsArr;
  }

  // For removing filters without recontruction
  removeFilters(filters: string[]) {
    const curFils = this.app.stage.filters;
    var curFilsArr: Filter[] = Array.isArray(curFils)
      ? curFils
      : curFils
      ? [curFils]
      : [];

    for (const filter of filters) {
      switch (filter) {
        case "blur": {
          curFilsArr = curFilsArr.filter((f) => !(f instanceof BlurFilter));
          break;
        }
        case "bloom": {
          curFilsArr = curFilsArr.filter((f) => !(f instanceof BloomFilter));
          break;
        }
        case "shockwave": {
          curFilsArr = curFilsArr.filter(
            (f) => !(f instanceof ShockwaveFilter)
          );
          break;
        }
        case "noise": {
          curFilsArr = curFilsArr.filter(
            (f) => !(f instanceof SimplexNoiseFilter)
          );
          break;
        }
      }
    }
    this.app.stage.filters = curFilsArr;
  }
}
