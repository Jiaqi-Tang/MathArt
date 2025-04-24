import { Container, Graphics } from 'pixi.js';

export class nestCon {
  #layer;
  #numChildren;
  #shape;
  #radius;
  #colour;
  #moveDir;
  #distance;
  #maxDist;
  #minDist;
  #children;

  #rotationFunc;
  #moveFunc;


  constructor(layers, numChildren = 6, shape = 0, radius = '10', colour = 'white', moveDir = true,
    distance = 1, rotationFunc = null, moveFunc = null) {
    
    this.#layer = layers;
    this.#numChildren = numChildren;
    this.#shape = shape;
    this.#radius = radius;
    this.#colour = colour;
    this.#moveDir = moveDir;
    this.#distance = distance; // Replace with function

    // TO DO
    this.#maxDist = 1.5 * (radius + 1) * (Math.pow(3, layers - 1));
    this.#minDist = 0.5 * (radius + 1) * (Math.pow(3, layers - 1));

    this.#children = [];
    this.container = new Container();

    if(rotationFunc == null){
      // Defult function that rotates
      this.#rotationFunc = function(angle){
        this.container.rotation += this.#layer * this.#layer * angle;
      }
    }else{
      this.#rotationFunc = rotationFunc;
    }

    if(moveFunc == null){
      // Default function that moes in then out
      this.#moveFunc = function(scale){
        const angle = 2 * Math.PI / this.#numChildren;

        for(let i = 0; i < this.#children.length; i++){
          const child = this.#children[i];
          if(Math.sqrt(Math.pow(child.x, 2) + Math.pow(child.y, 2)) >= child.#maxDist){
            child.#moveDir = false;
          }else if(Math.sqrt(Math.pow(child.x, 2) + Math.pow(child.y, 2)) <= child.#minDist){
            child.#moveDir = true;
          }

          child.container.x += child.#moveDir + scale * Math.cos(i * angle + this.container.rotation);
          child.container.y += child.#moveDir + scale * Math.sin(i * angle + this.container.rotation);
        }
      }
    }else{
      this.#rotationFunc = rotationFunc;
    }

    // Extend If statement to support more shapes
    if(shape == 0){
      this.#shape = new Graphics()
        .circle(0, 0, radius)
        .fill(this.#colour);
    } 
    this.container.addChild(this.#shape);

    // Creates children
    if(layers > 1){
      for(let i = 0; i < this.#numChildren; i++){
        const child = new nestCon(layers - 1, numChildren, shape, radius, colour, moveDir, 
          distance, rotationFunc, moveFunc)
        
        this.#children.push(child);

        const angle = 2 * Math.PI / this.#numChildren;
        const dist = (radius + 1) * (Math.pow(3, layers - 1));
        child.container.x = dist * Math.cos(i * angle);
        child.container.y = dist * Math.sin(i * angle);
        this.container.addChild(child.container);
      }
    }
  }
  
  // Called on time interval to move the container
  motion(scale){
    if(this.#layer == 1){
      return;
    }

    this.#rotationFunc(scale);
    // this.#moveFunc(scale)
    
    for(let i = 0; i < this.#children.length; i++){
      this.#children[i].motion(scale);
    }
  }
}
