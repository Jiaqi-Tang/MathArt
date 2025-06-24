import { Container, Graphics, Filter } from "pixi.js";
import { GlowFilter, OutlineFilter } from "pixi-filters";
import { drawShape } from "./tools/functions";

export interface SpinConOptions {
  layers?: number;
  numChildren?: number;
  shape_num?: number;
  radius?: number;
  colour?: string;
  motionFunc?: number;
  filters?: string[];
  effects?: string[]; // To be implemented
}

interface setShapeProps {
  shape_num?: number;
  colour?: string;
}

// Nested containers class whihch is the core part for Spin Art
// Each shape is added to its parent's container so they can be spun
export class SpinCon {
  private layer: number;
  private numChildren: number;
  private shape_num: number;
  private radius: number;
  private colour: string;

  private distance: number;
  private children: SpinCon[];
  private moveControls: number[];
  private motionFunc: (scale: number) => void;

  private shape: Graphics;
  public container: Container;

  // Creates NestCon
  public constructor(options: SpinConOptions) {
    // Reads in input parameters
    this.layer = options.layers ?? 4;
    this.numChildren = options.numChildren ?? 6;
    this.shape_num = options.shape_num ?? 0;
    this.radius = options.radius ?? 10;
    this.colour = options.colour ?? "white";

    // Init variables
    this.container = new Container();
    this.children = [];
    this.distance = (this.radius + 2) * Math.pow(3, this.layer - 1);

    // Sets motion function
    this.moveControls = [];
    this.motionFunc = function (scale) {};
    this.setMotionFunc(options.motionFunc ?? 0);

    // Sets shape
    this.shape = new Graphics();
    this.container.addChild(this.shape);
    const temp = drawShape(
      this.shape,
      this.shape_num,
      this.radius,
      this.colour
    );
    this.shape_num = Number(temp[0]);
    this.colour = String(temp[1]);

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
        const child = new SpinCon(childOptions);
        this.children.push(child);

        const angle = (2 * Math.PI) / this.numChildren;
        child.container.x = this.distance * Math.cos(i * angle);
        child.container.y = this.distance * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }

  // For manual destruction
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
        // Circle centered at 2/3 distance\
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
        // Sin wave
        this.moveControls[0] = 1; // coefficient of sin
        this.moveControls[1] = 0; // randians, [0, 2PI]
        this.motionFunc = function (scale) {
          const containerAngle = (2 * Math.PI) / this.numChildren;
          for (let i = 0; i < this.children.length; i++) {
            const childCon = this.children[i].container;
            const theta = -1 * i * containerAngle;
            const s = ((3 / 2) * Math.PI) / this.distance;
            const tx = (1 / 2) * Math.PI;

            const curDist = Math.sqrt(
              Math.pow(childCon.x, 2) + Math.pow(childCon.y, 2)
            );

            this.moveControls[1] +=
              1.7 * this.moveControls[0] * scale * this.layer;
            if (this.moveControls[1] <= 0) {
              this.moveControls[0] = 1;
            } else if (this.moveControls[1] >= 2 * Math.PI) {
              this.moveControls[0] = -1;
            }

            childCon.x =
              ((this.moveControls[1] - tx) * Math.cos(theta) +
                this.moveControls[0] *
                  Math.sin(this.moveControls[1]) *
                  Math.sin(theta)) /
              s;
            childCon.y =
              ((this.moveControls[1] - tx) * -1 * Math.sin(theta) +
                this.moveControls[0] *
                  Math.sin(this.moveControls[1]) *
                  Math.cos(theta)) /
              s;
          }

          this.container.rotation += ((this.layer * this.layer) / 10) * scale;
        };
        break;
      }
      case 3: {
        this.moveControls[0] = -1; // Direction
        this.moveControls[1] =
          (0.5 + 24 / Math.pow(this.layer, 3)) * this.distance; // Max Distance
        this.moveControls[2] = (1 / this.layer) * this.distance; // Min Distance
        this.motionFunc = function (scale) {
          const angle = (2 * Math.PI) / this.numChildren;

          for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childContainer = child.container;
            const curDist = Math.sqrt(
              Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)
            );
            if (curDist >= this.moveControls[1]) {
              this.moveControls[0] = -1;
            } else if (curDist <= this.moveControls[2]) {
              this.moveControls[0] = 1;
            }

            const moveDist =
              30 *
              (this.moveControls[0] * Math.pow(this.distance, 2 / 3) +
                this.layer) *
              scale;
            childContainer.x += moveDist * Math.cos(i * angle);
            childContainer.y += moveDist * Math.sin(i * angle);
          }

          this.container.rotation += 5 * this.layer * scale;
        };
        break;
      }
      default: {
        this.moveControls[0] = -1;
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
              child.moveControls[0] = -1;
            } else if (
              Math.sqrt(
                Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)
              ) <= minDist
            ) {
              child.moveControls[0] = 1;
            }

            const moveDist =
              30 *
              (child.moveControls[0] * Math.pow(this.distance, 2 / 3) +
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

  // For changing shape or colour without reconstruction
  setShape({ shape_num, colour }: setShapeProps) {
    this.colour = colour ?? this.colour;
    this.shape_num = shape_num ?? this.shape_num;
    const temp = drawShape(
      this.shape,
      this.shape_num,
      this.radius,
      this.colour
    );
    this.shape_num = Number(temp[0]);
    this.colour = String(temp[1]);

    // Recurse on children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setShape({ shape_num, colour });
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

    // Recurse on children
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

    // Recurse on children
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

    // Recurse on children
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].motion(scale);
    }
  }
}
