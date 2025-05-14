import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { Application } from "pixi.js";

const NUM_LAYERS = 4;

export function SpinArtPreview(options: NestConOptions) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
  const spinMultiplierRef = useRef<number>(1);
  const [parentWidth, setParentWidth] = useState<number | null>(null);

  // Phase 1: Measure parent width
  useLayoutEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.getBoundingClientRect().width;
      setParentWidth(width);
    }
  }, []);

  // Phase 2: Once width is known, render canvas and initialize Pixi
  useEffect(() => {
    if (!canvasRef.current || parentWidth === null) return;

    const LENGTH_RADIUS = parentWidth / 80;
    const canvas = canvasRef.current;

    (async () => {
      const app = new Application();
      await app.init({
        canvas: canvas,
        background: "black",
        width: parentWidth,
        height: parentWidth,
      });

      appRef.current = app;

      const rootNC = new nestCon(NUM_LAYERS, { radius: LENGTH_RADIUS });
      rootNCRef.current = rootNC;

      rootNC.container.position.set(parentWidth / 2, parentWidth / 2);
      app.stage.addChild(rootNC.container);

      app.ticker.add((time) => {
        rootNC.motion(spinMultiplierRef.current * 0.001 * time.deltaTime);
      });
    })();
  }, [parentWidth]);

  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      {/* Only render the canvas after width is known */}
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}
