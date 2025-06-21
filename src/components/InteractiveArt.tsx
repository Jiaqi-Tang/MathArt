import { useEffect, useRef, useState, useLayoutEffect } from "react";

import { spinCon } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";

// Prop to take in User Input
interface Prop {
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
export default function SpinArtInteractive({
  speed,
  layers,
  children,
  shape,
  func,
  colour,
  filters,
  onZoom,
}: Prop) {
  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootNCRef = useRef<spinCon | null>(null);
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
      rootNCRef.current = new spinCon({ radius: parentWidth / 80 });
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
   *    - Zoom in/out
   *    - Type of shape (triangle, square, star) DONE
   *   Reconstruction:
   *    - Number of children DONE
   *    - Number of layers DONE
   *    - Motion function (movement of circles, select from a list of options)
   *   Effects:
   *    - Colors of shape/background DONE
   *    - Trail effects of tail
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

    rootNCRef.current = new spinCon({
      layers: layers,
      radius: parentWidth / 80,
      numChildren: children,
      colour: colour,
      motionFunc: func,
      shape: shape,
    });
    rootNCRef.current.container.position.set(0, 0);
    ACRef.current.addChild(rootNCRef.current.container);

    for (const filter of filters) {
      if (NESTCON_FILTERS.includes(filter)) {
        rootNCRef.current.addFilters([filter]);
      }
    }
  }, [layers, children, func]);

  // User time interaction for Filter Update
  useEffect(() => {
    if (!rootNCRef.current || !ACRef.current) {
      return;
    }

    // Get exact Filters being add/removed
    const added = filters.filter((f) => !previousFilters.includes(f));
    const removed = previousFilters.filter((f) => !filters.includes(f));

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

    setPreviousFilters(filters);
  }, [filters]);

  // User time interaction for Speed Update
  useEffect(() => {
    spinSpeed.current = speed;
  }, [speed]);

  // User time interaction for Colout and Shape updates
  useEffect(() => {
    rootNCRef.current?.setShape({ colour: colour });
  }, [colour]);

  useEffect(() => {
    rootNCRef.current?.setShape({ shape_num: shape });
  }, [shape]);

  useEffect(() => {
    ACRef.current?.refreshZoom();
  }, [onZoom]);

  return (
    // Wrapper for accessing parent width
    <div className="interactive__art" ref={wrapperRef}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}
