import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { SpinCon } from "../pixi/NestedContainer";
import { ArtCanvas } from "../pixi/ArtCanvas";

// Prop to take in User Input
interface InteractiveOptions {
  speed: number;
  layers: number;
  children: number;
  shape: number;
  func: number;
  colour: string;
  filters: string[];
  onZoom: boolean;
}

// List of Valid Filters
const CANVAS_FILTERS = ["blur", "bloom", "noise"];
const NESTCON_FILTERS = ["glow", "outline"];
export const AVALIABLE_FILTERS = [...CANVAS_FILTERS, ...NESTCON_FILTERS];
export const AVALIABLE_SHAPES = [0, 1, 2, 3, 4];
export const AVALIABLE_FUNCTIONS = [0, 1, 2, 3];

// Interactive Spin Art Component
export function SpinArtInteractive(states: InteractiveOptions) {
  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootNCRef = useRef<SpinCon | null>(null);
  const ACRef = useRef<ArtCanvas | null>(null);

  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const [previousFilters, setPreviousFilters] = useState<string[]>([]);
  const spinSpeed = useRef(1);

  // Get width of parent to maximize size of Art Piece
  useLayoutEffect(() => {
    if (wrapperRef.current) {
      const width = Math.min(
        wrapperRef.current.getBoundingClientRect().width,
        window.innerHeight
      );
      setParentWidth(width);
    }
  }, []);

  // Create Art Piece
  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;

    const canvas = canvasRef.current;

    (async () => {
      // Create Canvas
      ACRef.current = await ArtCanvas.create({
        canvas,
        height: parentWidth,
        width: parentWidth,
        zoom: true,
      });

      // Prevent browser scroll so scroll is for Zoom only
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
      };
      canvas.addEventListener("wheel", handleWheel, { passive: false });

      // Init Spining Containers by creating Root Container
      rootNCRef.current = new SpinCon({ radius: parentWidth / 80 });
      rootNCRef.current.container.position.set(0, 0);
      ACRef.current.refreshZoom();
      ACRef.current.addChild(rootNCRef.current.container);

      // Updates Canvas on time interval to spin
      ACRef.current.app.ticker.add((time) => {
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
   *    - Zoom in/out DONE
   *    - Type of shape (triangle, square, star) DONE
   *   Reconstruction:
   *    - Number of children DONE
   *    - Number of layers DONE
   *    - Motion function (movement of circles, select from a list of options) DONE
   *   Effects:
   *    - Colors of shape/background DONE
   *    - Trail effects of tail <-------- Waiting on this
   *    - Other visual effects (blur, filters, dynamic colors) DONE
   */

  // User time interactions that require reconstruction of Containers
  useEffect(() => {
    if (!ACRef.current || !parentWidth) return;

    // Reset Zoom
    ACRef.current.refreshZoom();

    // Remove old Containers
    if (rootNCRef.current) {
      ACRef.current.removeChild(rootNCRef.current.container);
      rootNCRef.current.destroy();
    }

    // Create new Containers with the updated user input
    rootNCRef.current = new SpinCon({
      layers: states.layers,
      radius: parentWidth / 80,
      numChildren: states.children,
      colour: states.colour,
      motionFunc: states.func,
      shape_num: states.shape,
    });
    rootNCRef.current.container.position.set(0, 0);
    ACRef.current.addChild(rootNCRef.current.container);

    for (const filter of states.filters) {
      if (NESTCON_FILTERS.includes(filter)) {
        rootNCRef.current.addFilters([filter]);
      }
    }
  }, [states.layers, states.children, states.func]);

  // User time interaction for Filter Update
  useEffect(() => {
    if (!rootNCRef.current || !ACRef.current) {
      return;
    }

    // Get exact Filters being add/removed
    const added = states.filters.filter((f) => !previousFilters.includes(f));
    const removed = previousFilters.filter((f) => !states.filters.includes(f));

    if (added.length > 0) {
      for (const filter of added) {
        if (NESTCON_FILTERS.includes(filter)) {
          rootNCRef.current.addFilters([filter]);
        } else if (CANVAS_FILTERS.includes(filter)) {
          ACRef.current.addFilters([filter]);
        }
      }
    }
    if (removed.length > 0) {
      for (const filter of removed) {
        if (NESTCON_FILTERS.includes(filter)) {
          rootNCRef.current.removeFilters([filter]);
        } else if (CANVAS_FILTERS.includes(filter)) {
          ACRef.current.removeFilters([filter]);
        }
      }
    }

    setPreviousFilters(states.filters);
  }, [states.filters]);

  // User time interaction for Speed Update
  useEffect(() => {
    spinSpeed.current = states.speed;
  }, [states.speed]);

  // User time interaction for Colour updates
  useEffect(() => {
    rootNCRef.current?.setShape({
      colour: states.colour == "#NaNNaNNaN" ? "#ffffff" : states.colour,
    });
  }, [states.colour]);

  // User time interaction for Shape updates
  useEffect(() => {
    rootNCRef.current?.setShape({ shape_num: states.shape });
  }, [states.shape]);

  // User time interaction for Resetting Zoom
  useEffect(() => {
    ACRef.current?.refreshZoom();
  }, [states.onZoom]);

  return (
    // Wrapper for accessing parent width
    <div className="interactive__art" ref={wrapperRef}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}

interface PreviewOptions {
  layers?: number;
  numChildren?: number;
  shape_num?: number;
  radius?: number;
  colour?: string;
  motionFunc?: number;
  filters?: string[];
  effects?: string[]; // To be implemented
}

export function SpinArtPreview(options: PreviewOptions) {
  const NCO = { ...options };

  // Parses filters
  NCO.filters = [];
  var ACFilters: string[] = [];
  if (options.filters) {
    for (const filter of options.filters) {
      if (NESTCON_FILTERS.includes(filter)) {
        NCO.filters.push(filter);
      } else if (CANVAS_FILTERS.includes(filter)) {
        ACFilters.push(filter);
      }
    }
  }

  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootNCRef = useRef<SpinCon | null>(null);
  const ACRef = useRef<ArtCanvas | null>(null);

  const [parentWidth, setParentWidth] = useState<number | null>(null);

  // Get width of parent to set size of Art Piece
  useLayoutEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.getBoundingClientRect().width;
      setParentWidth(width);
    }
  }, []);

  // Create Art Piece
  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;

    NCO.radius = options.radius ?? parentWidth / 80;
    const canvas = canvasRef.current;

    (async () => {
      // Create Canvas
      ACRef.current = await ArtCanvas.create({
        canvas,
        height: parentWidth,
        width: parentWidth,
      });
      ACRef.current.addFilters(ACFilters);

      // Create Containers
      rootNCRef.current = new SpinCon(NCO);
      rootNCRef.current.container.position.set(0, 0);
      ACRef.current.refreshZoom();
      ACRef.current.addChild(rootNCRef.current.container);

      // Updates Canvas on time interval to spin
      ACRef.current.app.ticker.add((time) => {
        if (rootNCRef.current) {
          rootNCRef.current.motion(0.001 * time.deltaTime);
        }
      });
    })();
  }, [parentWidth]);

  return (
    // Wrapper for accessing parent width
    <div ref={wrapperRef} style={{ width: "100%" }}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}
