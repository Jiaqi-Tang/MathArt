import React, { useEffect, useRef, useState, useLayoutEffect  } from "react";
import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

const SCALE = 0.97;

interface Prop {
  interactive: boolean;
  spinSpeed?: number;
  numChildren?: number;
  numLayers?: number;
}


const NUM_LAYERS = 4;

export default function SpinArtInteractive({ interactive, spinSpeed, numChildren, numLayers }: Prop) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);

  const spinMultiplierRef = useRef<number>(1);

  const LENGTH_RADIUS = 10;

  useLayoutEffect(() => {
      if (wrapperRef.current) {
        const width = Math.min(wrapperRef.current.getBoundingClientRect().width, window.innerHeight);
        setParentWidth(width);
      }
    }, []);
  

  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;
    
    const canvas = canvasRef.current;
    (async () =>
    {
      const LENGTH_RADIUS = parentWidth / 80;

      // Init Application
      const app = new Application();
      await app.init({ canvas: canvas, background: 'black', height: parentWidth, width: parentWidth });
      appRef.current = app;
      
      // Init Zoom
      const viewport = new Viewport({
        screenWidth: parentWidth,
        screenHeight: parentWidth,
        events: app.renderer.events
      });
      viewportRef.current = viewport;
      app.stage.addChild(viewport);

      if(interactive){
        viewport
          .drag()
          .pinch()
          .wheel();

          const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
          };
          canvas.addEventListener("wheel", handleWheel, { passive: false });
      }

      // Init Root Container
      const rootNC = new nestCon(NUM_LAYERS, {radius: LENGTH_RADIUS});
      rootNCRef.current = rootNC;
      viewport.addChild(rootNC.container);
      rootNC.container.position.set(0, 0);
      viewport.moveCenter(0, 0);

      // Updates Canvas on time interval to create motion
      app.ticker.add((time) => {
        if (rootNCRef.current) {
          rootNCRef.current.motion(spinMultiplierRef.current * 0.001 * time.deltaTime);
        }
      });
    })();
  }, [parentWidth]);

  /* 
   * What to customize when interactive:
   *   No reconstruction: DONE
   *    - Speed of motion
   *    - Zoom in/out
   *   Reconstruction:
   *    - Number of children DONE
   *    - Number of layers DONE
   *    - Motion function (movement of circles, select from a list of options)
   *   Effects:
   *    - Colors of shape/background
   *    - Trail effects of tail
   *    - Other visual effects (blur, filters, dynamic colors)
   */
  if(interactive){
    useEffect(() => {
      spinMultiplierRef.current = spinSpeed ?? 1;
    }, [spinSpeed]);

    useEffect(() => {
      if (!appRef.current) return;
    
      const app = appRef.current;
      (async () =>
        {
          const viewport = viewportRef.current;
          if (!viewport){ // Error
            return;
          }

          viewport.setZoom(1); // Reset zoom level to 1 (default scale)
          viewport.moveCenter(0, 0); // Move to center
          
          // Remove old nestCon
          if (rootNCRef.current) {
            viewport.removeChild(rootNCRef.current.container);
            rootNCRef.current = null;
          }
        
          // Create new one
          const rootNC = new nestCon(numLayers ?? 4, { radius: LENGTH_RADIUS, numChildren: numChildren });
          rootNC.container.x = 0;
          rootNC.container.y = 0;
          rootNCRef.current = rootNC;

          viewport.addChild(rootNC.container);
        })();
    }, [numChildren, numLayers]);
  }


  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      {/* Only render the canvas after width is known */}
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}

