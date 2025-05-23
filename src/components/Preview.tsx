import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Application } from "pixi.js";

import { nestCon, NestConOptions } from "../pixi/nestedContainer";
import { ArtCanvas } from "../pixi/artCanvas";

export interface PreviewOptions{
  options: NestConOptions, 
  filters?: string[]
}

export function SpinArtPreview({options, filters} : PreviewOptions ) {
  const NCO = { ...options };

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const rootNCRef = useRef<nestCon | null>(null);
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

    NCO.radius = parentWidth / 80;
    
    const canvas = canvasRef.current;

    (async () => {
      // Init ArtCanvas
      const AC = await ArtCanvas.create(canvas, parentWidth, parentWidth);
      appRef.current = AC.app;
      if(filters){
        AC.addFilters(filters);
      }

      // Init NC
      const rootNC = new nestCon(NCO);
      rootNCRef.current = rootNC;

      rootNC.container.position.set(parentWidth / 2, parentWidth / 2);
      appRef.current.stage.addChild(rootNC.container);

      // Motion control
      appRef.current.ticker.add((time) => {
        rootNC.motion(0.001 * time.deltaTime);
      });
    })();
  }, [parentWidth]);

  return (
    <div ref={wrapperRef} style={{ width: "100%" }}>
      {parentWidth && <canvas ref={canvasRef} />}
    </div>
  );
}
