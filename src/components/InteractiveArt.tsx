import React, { useEffect, useRef, useState, useLayoutEffect  } from "react";
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";


const SCALE = 0.97;

interface Prop {
  interactive: boolean;
  spinSpeed?: number;
  numChildren?: number;
  numLayers?: number;
}


const NUM_LAYERS = 4;

export default function SpinArtInteractive({ spinSpeed, numChildren, numLayers }: Prop) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);

  const spinMultiplierRef = useRef<number>(1);

  // Get width of parent
  useLayoutEffect(() => {
      if (wrapperRef.current) {
        const width = Math.min(wrapperRef.current.getBoundingClientRect().width, window.innerHeight);
        setParentWidth(width);
      }
    }, []);

  // Init art piece
  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;

    const canvas = canvasRef.current;

    (async () => {
      const AC = await ArtCanvas.create(canvas, parentWidth, parentWidth);
      appRef.current = AC.app;
      
      // Init Zoom
      const viewport = new Viewport({
        screenWidth: parentWidth,
        screenHeight: parentWidth,
        events: AC.app.renderer.events
      });
      appRef.current.stage.addChild(viewport);

      viewportRef.current = viewport;
      viewport
        .drag()
        .pinch()
        .wheel();

      // Prevent browser scroll
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
      };
      canvas.addEventListener("wheel", handleWheel, { passive: false });

      // Init Root Container
      const rootNC = new nestCon({radius: parentWidth / 80});
      rootNCRef.current = rootNC;
      viewport.addChild(rootNC.container);

      rootNC.container.position.set(0, 0);
      viewport.moveCenter(0, 0);

      // Updates Canvas on time interval to create motion
      appRef.current.ticker.add((time) => {
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
   *    - Type of shape (triangle, square, star)
   *   Effects:
   *    - Colors of shape/background
   *    - Trail effects of tail
   *    - Other visual effects (blur, filters, dynamic colors)
   */
  useEffect(() => {
    spinMultiplierRef.current = spinSpeed ?? 1;
  }, [spinSpeed]);

  // User time interactions that cause reconstruction of nestCon
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !parentWidth){ // Error
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
    
    const rootNC = new nestCon({ layers: numLayers, radius: parentWidth / 80, numChildren: numChildren });
    rootNC.container.x = 0;
    rootNC.container.y = 0;
    rootNCRef.current = rootNC;

    viewport.addChild(rootNC.container);

  }, [numChildren, numLayers]);


  return (
    <div ref={wrapperRef}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}

