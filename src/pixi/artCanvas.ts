import { Application, BlurFilter, Filter } from "pixi.js";
import { BloomFilter, ShockwaveFilter, SimplexNoiseFilter } from "pixi-filters";


export class ArtCanvas{
  public app: Application;

  private constructor() {
    this.app = new Application();
  }

  public static async create(
    canvas: HTMLCanvasElement,
    height: number,
    width: number,
    background?: string
  ): Promise<ArtCanvas> {
    const instance = new ArtCanvas();
    instance.app = new Application();
    await instance.app.init({
      canvas: canvas,
      background: background ?? "black",
      width: width,
      height: height,
    });
    instance.app.stage.filters = [];
    return instance;
  }

    addFilter(filters: string[]){
        const curFils = this.app.stage.filters;
        const curFilsArr: Filter[] = Array.isArray(curFils) ? [...curFils] : curFils ? [curFils] : [];
        for(const filter of filters){
            switch(filter){
                case "blur":
                {
                    if (!curFilsArr.some(f => f instanceof BlurFilter)) {
                        curFilsArr.push(new BlurFilter());
                        this.app.stage.filters = curFilsArr;
                    }
                    break;
                }
                case "bloom":
                {
                    if (!curFilsArr.some(f => f instanceof BloomFilter)) {
                        curFilsArr.push(new BloomFilter());
                        this.app.stage.filters = curFilsArr;
                    }
                    break;
                }
                case "shockwave":
                {
                    if (!curFilsArr.some(f => f instanceof ShockwaveFilter)) {
                        curFilsArr.push(new ShockwaveFilter());
                        this.app.stage.filters = curFilsArr;
                    }
                    break;
                }
                case "noise":
                {
                    if (!curFilsArr.some(f => f instanceof SimplexNoiseFilter)) {
                        curFilsArr.push(new SimplexNoiseFilter());
                        this.app.stage.filters = curFilsArr;
                    }
                    break;
                }
            }
        }
    }

    removeFilter(filters: string[]){
        const curFils = this.app.stage.filters;
        var curFilsArr: Filter[] = Array.isArray(curFils) ? curFils : curFils ? [curFils] : [];

        for(const filter in filters){
            switch(filter){
                case "blur":
                {
                    curFilsArr = curFilsArr.filter(f => !(f instanceof BlurFilter));
                    break;
                }
                case "bloom":
                {
                    curFilsArr = curFilsArr.filter(f => !(f instanceof BloomFilter));
                    break;
                }
                case "shockwave":
                {
                    curFilsArr = curFilsArr.filter(f => !(f instanceof ShockwaveFilter));
                    break;
                }
                case "noise":
                {
                    curFilsArr = curFilsArr.filter(f => !(f instanceof SimplexNoiseFilter));
                    break;
                }
            }
        }
    }
}
