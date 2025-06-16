import { useRef, useEffect } from "react";
import { Application, Graphics } from "pixi.js";
import { drawShape } from "../../pixi/tools/functions";
import { SpinArtPreview } from "../Preview";

interface ShapeButtonProps {
  size: number;
  name: number;
  shape: number;
  colour: string;
  onClick: (name: number) => void;
}

export function ShapeButton({
  size,
  name,
  shape,
  colour,
  onClick,
}: ShapeButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    (async () => {
      const app = new Application();
      await app.init({
        canvas: canvas,
        backgroundAlpha: 0,
        width: size,
        height: size,
      });

      const g = new Graphics();
      drawShape(g, name, size / 3, colour);

      app.stage.addChild(g);
      g.position.set(size / 2, size / 2);
    })();
  }, []);

  return (
    <button
      key={name}
      onClick={() => onClick(shape)}
      className={`art-control-btn shape-btn${name == shape ? " active" : ""}`}
    >
      <canvas ref={canvasRef}></canvas>
    </button>
  );
}

interface FilterButtonProps {
  name: string;
  filters: string[];
  onClick: (name: string) => void;
}

export function FilterButton({ name, filters, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`art-control-btn filter-btn${
        filters.includes(name) ? " active" : ""
      }`}
    >
      {name}
    </button>
  );
}

interface SpinButtonProps {
  size: number;
  name: number;
  func: number;
  onClick: (name: number) => void;
}

export function SpinButton({ size, name, func, onClick }: SpinButtonProps) {
  return (
    <button
      onClick={() => onClick(func)}
      className={`art-control-btn shape-btn${name == func ? " active" : ""}`}
      style={{ height: size, width: size }}
    >
      <SpinArtPreview options={{ layers: 2, motionFunc: name }} />
    </button>
  );
}
