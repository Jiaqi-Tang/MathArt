import React, { useEffect, useRef } from "react";
import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { Application } from 'pixi.js';

interface Prop {
  interactive: boolean;
}

export default function SpinArtDefault({ interactive }: Prop) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      (async () =>
        {
          const height = window.innerHeight;
          const app = new Application();
          await app.init({ view: canvas, background: 'black', height: height, width: height });
            
          // Constants
          const LENGTH_RADIUS = height / 100;
          const NUM_LAYERS = 4;
      
          // Root Container
          const rootNC = new nestCon(NUM_LAYERS, {radius: LENGTH_RADIUS});
          rootNC.container.x = height / 2;
          rootNC.container.y = height / 2;
          app.stage.addChild(rootNC.container);
      
          // Updates Canvas on time interval to create motion
          app.ticker.add((time) =>
          {
            rootNC.motion(0.001 * time.deltaTime);
          });
          
        })();
    }
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export function SpinArtSpinOnly({ interactive }: Prop) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      (async () =>
        {
          const height = window.innerHeight;
          const app = new Application();
          await app.init({ view: canvas, background: 'black', height: height, width: height });
            
          // Constants
          const LENGTH_RADIUS = height / 100;
          const NUM_LAYERS = 4;
      
          // Root Container
          const rootNC = new nestCon(NUM_LAYERS, {radius: LENGTH_RADIUS, moveFunc: function(scale: number){ return}});
          rootNC.container.x = height / 2;
          rootNC.container.y = height / 2;
          app.stage.addChild(rootNC.container);
      
          // Updates Canvas on time interval to create motion
          app.ticker.add((time) =>
          {
            rootNC.motion(0.001 * time.deltaTime);
          });
          
        })();
    }
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export function SpinArtMoveOnly({ interactive }: Prop) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      (async () =>
        {
          const height = window.innerHeight;
          const app = new Application();
          await app.init({ view: canvas, background: 'black', height: height, width: height });
            
          // Constants
          const LENGTH_RADIUS = height / 100;
          const NUM_LAYERS = 4;
      
          // Root Container
          const rootNC = new nestCon(NUM_LAYERS, {radius: LENGTH_RADIUS, rotationFunc: function(scale: number){ return}});
          rootNC.container.x = height / 2;
          rootNC.container.y = height / 2;
          app.stage.addChild(rootNC.container);
      
          // Updates Canvas on time interval to create motion
          app.ticker.add((time) =>
          {
            rootNC.motion(0.001 * time.deltaTime);
          });
          
        })();
    }
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
