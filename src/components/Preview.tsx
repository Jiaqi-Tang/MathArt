import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Application } from "pixi.js";
import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";

// Input Options
export interface PreviewOptions{
  options: NestConOptions, 
  filters?: string[]
}

export function SpinArtPreview({options, filters} : PreviewOptions ) {
  // Make copy to modify input as needed
  const NCO = { ...options };

  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
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

    NCO.radius = parentWidth / 80;
    const canvas = canvasRef.current;

    (async () => {
      // Create Canvas
      const AC = await ArtCanvas.create(canvas, parentWidth, parentWidth);
      appRef.current = AC.app;
      if(filters){ // Add Canvas filters
        AC.addFilters(filters);
      }

      // Create Containers
      const rootNC = new nestCon(NCO);
      rootNCRef.current = rootNC;
      rootNC.container.position.set(parentWidth / 2, parentWidth / 2);
      appRef.current.stage.addChild(rootNC.container);

      // Updates Canvas on time interval to spin
      appRef.current.ticker.add((time) => {
        rootNC.motion(0.001 * time.deltaTime);
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
