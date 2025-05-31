import { useEffect, useRef, useState, useLayoutEffect  } from "react";
import { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { nestCon } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";

// Prop to take in User Input
interface Prop {
  speed: number;
  children: number;
  layers: number;
  color: string;
  filters: string[];
}

// List of Valid Filters
const CANVAS_FILTERS = ["blur", "bloom", "noise"];
const NESTCON_FILTERS = ["glow", "outline"];
export const AVAIABLE_FILTERS = [...CANVAS_FILTERS, ...NESTCON_FILTERS];

// Interactive Spin Art Component
export default function SpinArtInteractive({speed, children, layers, color, filters}: Prop) {
  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
  const ACRef = useRef<ArtCanvas | null>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const [previousFilters, setPreviousFilters] = useState<string[]>([]);
  const spinSpeed = useRef(1);

  // Get width of parent to maximize size of Art Piece
  useLayoutEffect(() => {
      if (wrapperRef.current) {
        const width = Math.min(wrapperRef.current.getBoundingClientRect().width, window.innerHeight);
        setParentWidth(width);
      }
    }, []);

  // Create Art Piece
  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;

    const canvas = canvasRef.current;

    (async () => {
      // Create Canvas
      const AC = await ArtCanvas.create(canvas, parentWidth, parentWidth);
      ACRef.current = AC;
      appRef.current = AC.app;
      
      // Create Viewport
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

      // Prevent browser scroll so scroll is for Zoom only
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
      };
      canvas.addEventListener("wheel", handleWheel, { passive: false });

      // Init Spining Containers by creating Root Container
      const rootNC = new nestCon({radius: parentWidth / 80});
      rootNCRef.current = rootNC;
      viewport.addChild(rootNC.container);
      rootNC.container.position.set(0, 0);
      viewport.moveCenter(0, 0);

      // Updates Canvas on time interval to spin
      appRef.current.ticker.add((time) => {
        if (rootNCRef.current) {
          rootNCRef.current.motion(spinSpeed.current * 0.001 * time.deltaTime);
        }
      });
    })();
  }, [parentWidth]);

  /* 
   * What to customize when interactive:
   *   No reconstruction: 
   *    - Speed of motion DONE
   *    - Zoom in/out
   *   Reconstruction:
   *    - Number of children DONE
   *    - Number of layers DONE
   *    - Motion function (movement of circles, select from a list of options)
   *    - Type of shape (triangle, square, star)
   *   Effects:
   *    - Colors of shape/background DONE
   *    - Trail effects of tail
   *    - Other visual effects (blur, filters, dynamic colors) DONE
   */


  // User time interactions that require reconstruction of Containers
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !parentWidth){ // Error
      return;
    }

    // Reset Zoom
    viewport.setZoom(1); 
    viewport.moveCenter(0, 0); 
    
    // Remove old Containers
    if (rootNCRef.current) {
      viewport.removeChild(rootNCRef.current.container);
      rootNCRef.current.container.destroy({ children: true });
      // rootNCRef.current = null;
    }

    // Create new Containers with the updated user input
    const rootNC = new nestCon({ layers: layers, radius: parentWidth / 80, numChildren: children, colour: color });
    rootNC.container.x = 0;
    rootNC.container.y = 0;
    rootNCRef.current = rootNC;
    viewport.addChild(rootNC.container);

  }, [layers, children, color]);

  // User time interaction for Filter Update
  useEffect(() => {
    if (!rootNCRef.current || !ACRef.current){
      return;
    }

    // Get exact Filters being add/removed
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

  // User time interaction for Speed Update
  useEffect(() => {
    spinSpeed.current = speed;
  }, [speed]);


  return (
    // Wrapper for accessing parent width
    <div ref={wrapperRef}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}

