import React, { useEffect, useRef } from "react";
import { initSpinArt } from "../pixi/spinArt";

export default function SpinArtBasic({ interactive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      initSpinArt({
        view: canvasRef.current,
        width: 800,
        height: 800,
        interactive,
      });
    }
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
