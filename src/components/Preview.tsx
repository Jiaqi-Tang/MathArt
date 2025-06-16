import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { spinCon, NestConOptions } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";

// Input Options
export interface PreviewOptions {
  options: NestConOptions;
  filters?: string[];
}

export function SpinArtPreview({ options, filters }: PreviewOptions) {
  // Make copy to modify input as needed
  const NCO = { ...options };

  // Refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootNCRef = useRef<spinCon | null>(null);
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
      if (filters) {
        // Add Canvas filters
        ACRef.current.addFilters(filters);
      }

      // Create Containers
      rootNCRef.current = new spinCon(NCO);
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
