import { Container, Graphics, Filter } from 'pixi.js';
import { GlowFilter, OutlineFilter } from "pixi-filters";


export interface NestConOptions {
  layers?: number;
  numChildren?: number;
  shape?: number;
  radius?: number;
  colour?: string;
  motionFunc?: number;
  filters?: string[];
  effects?: string[]; // To be implemented
}

export class nestCon {
  private layer: number;
  private numChildren: number;
  private shape: Graphics;
  private radius: number;
  private colour: string;
  private moveControl: number;
  private distance: number;

  private children: nestCon[];
  private motionFunc: (scale: number) => void;

  public container: Container;

  public constructor(options: NestConOptions) {

    this.layer = options.layers ?? 4;
    this.numChildren = options.numChildren ?? 6;
    this.radius = options.radius ?? 10;
    this.colour = options.colour ?? 'white';

    // Distance to children
    this.distance = (this.radius + 2) * (Math.pow(3, this.layer - 1));

    this.children = [];
    this.container = new Container();

    this.moveControl = -1;
    this.motionFunc = function(scale){};
    this.setMotionFunc(options.motionFunc ?? 0);

    this.shape = new Graphics;
    this.setShape(options.shape ?? 0);

    this.shape.filters = [];
    if(options.filters){
      this.addFilters(options.filters);
    }

    // Creates children
    if(this.layer > 1){
      const childOptions = { ...options };
      childOptions.layers = this.layer - 1;
      for(let i = 0; i < this.numChildren; i++){
        const child = new nestCon(childOptions);
        
        this.children.push(child);

        const angle = 2 * Math.PI / this.numChildren;
        child.container.x = this.distance * Math.cos(i * angle);
        child.container.y = this.distance * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }

  private setMotionFunc(func : number){
    switch (func){
      case 1:
      {
        this.motionFunc = function(scale){
          const containerAngle = 2 * Math.PI / this.numChildren;
          for(let i = 0; i < this.children.length; i++){
            const childCon = this.children[i].container;

            const expX = (2 * this.distance / 3) * Math.cos(i * containerAngle);
            const expY = (2 * this.distance / 3) * Math.sin(i * containerAngle);

            const rotationAngle = Math.atan2(childCon.y - expY, childCon.x - expX);

            childCon.x = expX + (this.distance / 3) * Math.cos(rotationAngle + 7 * this.layer * scale);
            childCon.y = expY + (this.distance / 3) * Math.sin(rotationAngle + 7 * this.layer * scale);
          }

          this.container.rotation += this.layer * this.layer * scale;
        }
        break;
      }
      case 2:
      {
        this.moveControl = 1;
        this.motionFunc = function(scale){
          const containerAngle = 2 * Math.PI / this.numChildren;
          for(let i = 0; i < this.children.length; i++){
            const childCon = this.children[i].container;

            const expX = (2 * this.distance / 3) * Math.cos(i * containerAngle);
            const expY = (2 * this.distance / 3) * Math.sin(i * containerAngle);

            const rotationAngle = Math.atan2(childCon.y - expY, childCon.x - expX);

            childCon.x = expX + (this.distance / 3) * Math.cos(rotationAngle + 7 * this.layer * scale);
            childCon.y = expY + (this.distance / 3) * Math.sin(rotationAngle + 7 * this.layer * scale);
          }

          this.container.rotation += this.layer * this.layer * scale;
        }
        break;
      }
      default:
      {
        this.moveControl = -1;
        this.motionFunc = function(scale){
          const angle = 2 * Math.PI / this.numChildren;

          const maxDist = this.distance;
          const minDist = (1 / this.layer) * this.distance;

          for(let i = 0; i < this.children.length; i++){
            const child = this.children[i];
            const childContainer = child.container;
            if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) >= maxDist){
              child.moveControl = -1;
            }else if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) <= minDist){
              child.moveControl = 1;
            }

            const moveDist = 30 * (child.moveControl * Math.pow(this.distance, 2/3) + this.layer) * scale;
            childContainer.x += moveDist * Math.cos(i * angle);
            childContainer.y += moveDist * Math.sin(i * angle);
          }

          this.container.rotation += this.layer * this.layer * scale;
          // this.container.rotation += 5 * this.layer * scale;
        }
      }
    }
  }

  private setShape(shape: number){
    switch (shape){
      case 1: // Rectangle
      {
        this.shape = new Graphics()
          .rect(- this.radius, - this.radius, 2 * this.radius, 2 * this.radius)
          .fill(this.colour);
        break;
      } 
      case 2: // Triangle
      {
        const cx = 0; // center x
        const cy = 0; // center y
        const side = 2 * this.radius; // length of each side

        const height = (Math.sqrt(3) / 2) * side;

        const p1 = [cx, cy - (2 / 3) * height];           // top vertex
        const p2 = [cx - side / 2, cy + height / 3];      // bottom left
        const p3 = [cx + side / 2, cy + height / 3];      // bottom right

        this.shape = new Graphics()
          .poly([...p1, ...p2, ...p3])
          .fill(this.colour);
        break;
      }
      case 3:
      {
        // Star parameters
        const cx = 0; // center x
        const cy = 0; // center y
        const points = 5;
        const outerRadius = 1.3 * this.radius;
        const innerRadius = 0.7 * this.radius;

        // Build the star's vertices
        const vertices: number[] = [];
        for (let i = 0; i < points * 2; i++) {
          const angle = (Math.PI / points) * i;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          vertices.push(x, y);
        }

        this.shape = new Graphics()
          .poly(vertices)
          .fill(this.colour);
        
        break;
      }
      case 4: // Heart, inspired by https://codepen.io/jolx/pen/EVGyVP
      {
        const cx = 0; // center x
        const cy = 0; // center y
        const xSize = 1.1 * this.radius;
        const ySize = 0.8 * this.radius;
        const ySize2 = 1 * this.radius;
        const ySize3 = 1.5 * this.radius;

        this.shape = new Graphics()
          .bezierCurveTo(cx, cy - ySize, cx - xSize, cy - ySize, cx - xSize, cy)
          .bezierCurveTo(cx - xSize, cy + ySize, cx, cy + ySize2, cx, cy + ySize3)
          .bezierCurveTo(cx, cy + ySize2, cx + xSize, cy + ySize, cx + xSize, cy)
          .bezierCurveTo(cx + xSize, cy - ySize, cx, cy - ySize, cx, cy)
          .fill(this.colour);
          break;
      }
      default:
      {
        this.shape = new Graphics()
        .circle(0, 0, this.radius)
        .fill(this.colour);
      }
    }
    this.container.addChild(this.shape);
  }

  addFilters(filters: string[]){
    const curFils = this.shape.filters;
    const curFilsArr: Filter[] = Array.isArray(curFils) ? [...curFils] : curFils ? [curFils] : [];
    for(const filter of filters){
      switch(filter){
        case "outline":
        {
          if (!curFilsArr.some(f => f instanceof OutlineFilter)) {
            curFilsArr.push(new OutlineFilter());
          }
          break;
        }
        case "glow":
        {
          if (!curFilsArr.some(f => f instanceof GlowFilter)) {
            curFilsArr.push(new GlowFilter());
          }
          break;
        }
      }
    }
    this.shape.filters = curFilsArr;

    for(const child of this.children){
      child.addFilters(filters);
    }
  }

  removeFilters(filters: string[]){
    const curFils = this.shape.filters;
    var curFilsArr: Filter[] = Array.isArray(curFils) ? curFils : curFils ? [curFils] : [];

    for(const filter of filters){
      switch(filter){
        case "outline":
        {
          curFilsArr = curFilsArr.filter(f => !(f instanceof OutlineFilter));
          break;
        }
        case "glow":
        {
          curFilsArr = curFilsArr.filter(f => !(f instanceof GlowFilter));
          break;
        }
      }
    }
    this.shape.filters = curFilsArr;

    for(const child of this.children){
      child.removeFilters(filters);
    }
  }
  
  // Called on time interval to move the container
  motion(scale: number){
    this.motionFunc(scale);

    if(this.layer == 1){
      return;
    }
    
    for(let i = 0; i < this.children.length; i++){
      this.children[i].motion(scale);
    }
  }
}
