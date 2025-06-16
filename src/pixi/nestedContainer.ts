import { Container, Graphics, Filter } from "pixi.js";
import { GlowFilter, OutlineFilter } from "pixi-filters";
import { drawShape } from "./tools/functions";

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

// Nested containers class whihc is the core part for Spin Art
// Each shape is added to its parent's container so they can be spun
export class spinCon {
  private layer: number;
  private numChildren: number;
  private shape_num: number;
  private shape: Graphics;
  private radius: number;
  private colour: string;
  private moveControl: number;
  private distance: number;
  private children: spinCon[];
  private motionFunc: (scale: number) => void;
  public container: Container;

  // Creates NestCon
  public constructor(options: NestConOptions) {
    // Reads in input parameters
    this.layer = options.layers ?? 4;
    this.numChildren = options.numChildren ?? 6;
    this.shape_num = options.shape ?? 0;
    this.radius = options.radius ?? 10;
    this.colour = options.colour ?? "white";

    // Distance to children
    this.distance = (this.radius + 2) * Math.pow(3, this.layer - 1);

    // Init variables
    this.children = [];
    this.container = new Container();
    this.moveControl = -1;

    // Sets move function
    this.motionFunc = function (scale) {};
    this.setMotionFunc(options.motionFunc ?? 0);

    // Sets shape

    this.shape = new Graphics();
    this.container.addChild(this.shape);
    drawShape(this.shape, this.shape_num, this.radius, this.colour);

    // Adds Filters
    this.shape.filters = [];
    if (options.filters) {
      this.addFilters(options.filters);
    }

    // Creates children
    if (this.layer > 1) {
      const childOptions = { ...options };
      childOptions.layers = this.layer - 1;

      for (let i = 0; i < this.numChildren; i++) {
        const child = new spinCon(childOptions);
        this.children.push(child);

        const angle = (2 * Math.PI) / this.numChildren;
        child.container.x = this.distance * Math.cos(i * angle);
        child.container.y = this.distance * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }

  destroy() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].destroy();
    }
    this.shape.destroy;
    this.container.destroy;
  }

  // Helper function that holds all possible move functions
  private setMotionFunc(func: number) {
    switch (func) {
      case 1: {
        this.motionFunc = function (scale) {
          const containerAngle = (2 * Math.PI) / this.numChildren;
          for (let i = 0; i < this.children.length; i++) {
            const childCon = this.children[i].container;

            const expX =
              ((2 * this.distance) / 3) * Math.cos(i * containerAngle);
            const expY =
              ((2 * this.distance) / 3) * Math.sin(i * containerAngle);

            const rotationAngle = Math.atan2(
              childCon.y - expY,
              childCon.x - expX
            );

            childCon.x =
              expX +
              (this.distance / 3) *
                Math.cos(rotationAngle + 7 * this.layer * scale);
            childCon.y =
              expY +
              (this.distance / 3) *
                Math.sin(rotationAngle + 7 * this.layer * scale);
          }

          this.container.rotation += this.layer * this.layer * scale;
        };
        break;
      }
      case 2: {
        // Works but glitchy, likely computational / rounding stuff
        this.motionFunc = function (scale) {
          const containerAngle = (2 * Math.PI) / this.numChildren;
          for (let i = 0; i < this.children.length; i++) {
            const childCon = this.children[i].container;
            const theta = -1 * i * containerAngle;
            const s = ((3 / 2) * Math.PI) / this.distance;
            const tx = (1 / 2) * Math.PI;

            var radians =
              s *
                (childCon.x * Math.cos(theta) - childCon.y * Math.sin(theta)) +
              tx;

            // console.log(radians);

            radians = radians + 10 * this.layer * this.moveControl * scale;
            if (radians < 0) {
              this.moveControl = 1;
            } else if (radians > 2 * Math.PI) {
              this.moveControl = -1;
            }

            childCon.x =
              ((radians - tx) * Math.cos(theta) +
                this.moveControl * Math.sin(radians) * Math.sin(theta)) /
              s;
            childCon.y =
              ((radians - tx) * -1 * Math.sin(theta) +
                this.moveControl * Math.sin(radians) * Math.cos(theta)) /
              s;
          }

          this.container.rotation += ((this.layer * this.layer) / 10) * scale;
        };
        break;
      }
      case 3: {
        this.motionFunc = function (scale) {
          const angle = (2 * Math.PI) / this.numChildren;

          const maxDist = (0.5 + 8 / Math.pow(this.layer, 2)) * this.distance;
          const minDist = (1 / this.layer) * this.distance;

          for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childContainer = child.container;
            const curDist = Math.sqrt(
              Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)
            );
            if (curDist >= maxDist) {
              this.moveControl = -1;
            } else if (curDist <= minDist) {
              this.moveControl = 1;
            }

            const moveDist =
              30 *
              (this.moveControl * Math.pow(this.distance, 2 / 3) + this.layer) *
              scale;
            childContainer.x += moveDist * Math.cos(i * angle);
            childContainer.y += moveDist * Math.sin(i * angle);
          }

          this.container.rotation += this.layer * this.layer * scale;
        };
        break;
      }
      default: {
        this.motionFunc = function (scale) {
          const angle = (2 * Math.PI) / this.numChildren;

          const maxDist = this.distance;
          const minDist = (1 / this.layer) * this.distance;

          for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childContainer = child.container;
            if (
              Math.sqrt(
                Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)
              ) >= maxDist
            ) {
              child.moveControl = -1;
            } else if (
              Math.sqrt(
                Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)
              ) <= minDist
            ) {
              child.moveControl = 1;
            }

            const moveDist =
              30 *
              (child.moveControl * Math.pow(this.distance, 2 / 3) +
                this.layer) *
              scale;
            childContainer.x += moveDist * Math.cos(i * angle);
            childContainer.y += moveDist * Math.sin(i * angle);
          }

          this.container.rotation += this.layer * this.layer * scale;
        };
      }
    }
  }

  setShape(shape_num?: number, colour?: string) {
    this.colour = colour ?? this.colour;
    this.shape_num = shape_num ?? this.shape_num;
    drawShape(this.shape, this.shape_num, this.radius, this.colour);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setShape(shape_num, colour);
    }
  }

  // For adding filters without reconstruction
  addFilters(filters: string[]) {
    const curFils = this.shape.filters;
    const curFilsArr: Filter[] = Array.isArray(curFils)
      ? [...curFils]
      : curFils
      ? [curFils]
      : [];
    for (const filter of filters) {
      switch (filter) {
        case "outline": {
          if (!curFilsArr.some((f) => f instanceof OutlineFilter)) {
            curFilsArr.push(new OutlineFilter());
          }
          break;
        }
        case "glow": {
          if (!curFilsArr.some((f) => f instanceof GlowFilter)) {
            curFilsArr.push(new GlowFilter());
          }
          break;
        }
      }
    }
    this.shape.filters = curFilsArr;

    for (const child of this.children) {
      child.addFilters(filters);
    }
  }

  // For removing filters without recontruction
  removeFilters(filters: string[]) {
    const curFils = this.shape.filters;
    var curFilsArr: Filter[] = Array.isArray(curFils)
      ? curFils
      : curFils
      ? [curFils]
      : [];

    for (const filter of filters) {
      switch (filter) {
        case "outline": {
          curFilsArr = curFilsArr.filter((f) => !(f instanceof OutlineFilter));
          break;
        }
        case "glow": {
          curFilsArr = curFilsArr.filter((f) => !(f instanceof GlowFilter));
          break;
        }
      }
    }
    this.shape.filters = curFilsArr;

    for (const child of this.children) {
      child.removeFilters(filters);
    }
  }

  // Called on time interval to spin and move the container
  motion(scale: number) {
    this.motionFunc(scale);

    if (this.layer == 1) {
      return;
    }

    // Moves children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].motion(scale);
    }
  }
}
