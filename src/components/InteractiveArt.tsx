import { useEffect, useRef, useState, useLayoutEffect  } from "react";
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { nestCon } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";


interface Prop {
  speed: number;
  children: number;
  layers: number;
  color: string;
  filters: string[];
}

const CANVAS_FILTERS = ["blur", "bloom", "noise"];
const NESTCON_FILTERS = ["glow", "outline"];
export const AVAIABLE_FILTERS = [...CANVAS_FILTERS, ...NESTCON_FILTERS];

export default function SpinArtInteractive({speed, children, layers, color, filters}: Prop) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
  const ACRef = useRef<ArtCanvas | null>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const [previousFilters, setPreviousFilters] = useState<string[]>([]);
  
  const spinSpeed = useRef(1);

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
      ACRef.current = AC;
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
          rootNCRef.current.motion(spinSpeed.current * 0.001 * time.deltaTime);
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
    const rootNC = new nestCon({ layers: layers, radius: parentWidth / 80, numChildren: children, colour: color });
    rootNC.container.x = 0;
    rootNC.container.y = 0;
    rootNCRef.current = rootNC;

    viewport.addChild(rootNC.container);

  }, [layers, children, color]);

  useEffect(() => {
    if (!rootNCRef.current || !ACRef.current){
      return;
    }

    const added = filters.filter(f => !previousFilters.includes(f));
    const removed = previousFilters.filter(f => !filters.includes(f));

    if (added.length > 0) {
      for(const filter of added){
        if(NESTCON_FILTERS.includes(filter)){
          rootNCRef.current.addFilters([filter]);
        }else if(CANVAS_FILTERS.includes(filter)){
          ACRef.current.addFilters([filter]);
        }
      }
    }
    if (removed.length > 0) {
      for(const filter of removed){
        if(NESTCON_FILTERS.includes(filter)){
          rootNCRef.current.removeFilters([filter]);
        }else if(CANVAS_FILTERS.includes(filter)){
          ACRef.current.removeFilters([filter]);
        }
      }
    }

    setPreviousFilters(filters);
  }, [filters]);

  useEffect(() => {
    spinSpeed.current = speed;
  }, [speed]);


  return (
    <div ref={wrapperRef}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}

