import { Container, Graphics } from 'pixi.js';

interface NC {
  container: Container;
  motion(): void;
}

export interface NestConOptions {
  numChildren?: number;
  shape?: number;
  radius?: number;
  colour?: string;
  moveDir?: number;
  distance?: number;
  rotationFunc?: (scale: number) => void;
  moveFunc?: (scale: number) => void;
}


export class nestCon {
  private layer: number;
  private numChildren: number;
  private shape: Graphics;
  private radius: number;
  private colour: string;
  private moveDir: number;
  private distance: number;
  private maxDist: number;
  private minDist: number;
  private children: nestCon[];

  private moveFunc: (scale: number) => void;
  private rotationFunc: (scale: number) => void;

  public container: Container;

  public constructor(layers: number, options: NestConOptions) {
    
    this.layer = layers;
    this.numChildren = options.numChildren ? options.numChildren : 6;
    this.radius = options.radius ? options.radius : 10;
    this.colour = options.colour ? options.colour : 'white';
    this.moveDir = options.moveDir ? options.moveDir : 1;
    this.distance = options.distance ? options.distance : 1; // Replace with function

    // TO DO
    this.maxDist = 1.5 * (this.radius + 1) * (Math.pow(3, layers));
    this.minDist = 0.5 * (this.radius + 1) * (Math.pow(3, layers));

    this.children = [];
    this.container = new Container();

    if(!options.rotationFunc){
      // Defult function that rotates
      this.rotationFunc = function(angle){
        this.container.rotation += this.layer * this.layer * angle;
      }
    }else{
      this.rotationFunc = options.rotationFunc;
    }

    if(!options.moveFunc){
      // Default function that moes in then out
      this.moveFunc = function(scale){
        const angle = 2 * Math.PI / this.numChildren;

        for(let i = 0; i < this.children.length; i++){
          const child = this.children[i];
          const childContainer = child.container;
          if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) >= child.maxDist){
            child.moveDir = -1;
          }else if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) <= child.minDist){
            child.moveDir = 1;
          }

          childContainer.x += child.moveDir * (this.radius + 1) * (Math.pow(3, layers - 1)) * scale * Math.cos(i * angle + this.container.rotation);
          childContainer.y += child.moveDir * (this.radius + 1) * (Math.pow(3, layers - 1)) * scale * Math.sin(i * angle + this.container.rotation);
        }
      }
    }else{
      this.moveFunc = options.moveFunc;
    }

    // Extend If statement to support more shapes
    if(options.shape == 0){
      this.shape = new Graphics()
        .circle(0, 0, this.radius)
        .fill(this.colour);
    } else{
      this.shape = new Graphics()
        .circle(0, 0, this.radius)
        .fill(this.colour);
    }
    this.container.addChild(this.shape);

    // Creates children
    if(layers > 1){
      for(let i = 0; i < this.numChildren; i++){
        const child = new nestCon(layers - 1, options)
        
        this.children.push(child);

        const angle = 2 * Math.PI / this.numChildren;
        const dist = (this.radius + 1) * (Math.pow(3, layers - 1));
        child.container.x = dist * Math.cos(i * angle);
        child.container.y = dist * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }
  
  // Called on time interval to move the container
  motion(scale: number){
    if(this.layer == 1){
      return;
    }

    this.rotationFunc(scale);
    this.moveFunc(5 * scale)
    
    for(let i = 0; i < this.children.length; i++){
      this.children[i].motion(scale);
    }
  }
}
