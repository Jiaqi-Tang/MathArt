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
  motionFunc?: (scale: number) => void;
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

  private motionFunc: (scale: number) => void;

  public container: Container;

  public constructor(layers: number, options: NestConOptions) {
    
    this.layer = layers;
    this.numChildren = options.numChildren ? options.numChildren : 6;
    this.radius = options.radius ? options.radius : 10;
    this.colour = options.colour ? options.colour : 'white';
    this.moveDir = options.moveDir ? options.moveDir : -1;
    this.distance = options.distance ? options.distance : 1; // Replace with function


    this.distance = (this.radius + 1) * (Math.pow(3, layers - 1));

    this.maxDist = this.distance;
    this.minDist = (1 / layers) * this.distance;

    this.children = [];
    this.container = new Container();

    if(!options.motionFunc){
      // Defult function that rotates
      this.motionFunc = function(scale){
        const angle = 2 * Math.PI / this.numChildren;

        for(let i = 0; i < this.children.length; i++){
          const child = this.children[i];
          const childContainer = child.container;
          if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) >= this.maxDist){
            child.moveDir = -1;
          }else if(Math.sqrt(Math.pow(childContainer.x, 2) + Math.pow(childContainer.y, 2)) <= this.minDist){
            child.moveDir = 1;
          }

          const moveDist = 30 * (child.moveDir * Math.pow(this.distance, 2/3) + this.layer) * scale;
          childContainer.x += moveDist * Math.cos(i * angle);
          childContainer.y += moveDist * Math.sin(i * angle);
        }

        this.container.rotation += this.layer * this.layer * scale;
      }
    }else{
      this.motionFunc = options.motionFunc;
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
        child.container.x = this.distance * Math.cos(i * angle);
        child.container.y = this.distance * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }
  
  // Called on time interval to move the container
  motion(scale: number){
    if(this.layer == 1){
      return;
    }

    this.motionFunc(scale);
    
    for(let i = 0; i < this.children.length; i++){
      this.children[i].motion(scale);
    }
  }
}
