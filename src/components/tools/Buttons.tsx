import { useRef, useEffect, useState } from "react";
import { Application, Graphics } from "pixi.js";
import { drawShape } from "../../pixi/tools/functions";
import { SpinArtPreview } from "../SpinArt";

interface ChaosButtonProps {
  name: any;
  value: any;
  type: string;
  onClick: () => void;
}

export function ChaosButton({ name, value, type, onClick }: ChaosButtonProps) {
  return (
    <button
      key={name}
      onClick={() => onClick()}
      className={`art-control-btn text-btn chaos-btn${" " + type}${
        name == value ? " active" : ""
      }`}
    >
      Chaos
    </button>
  );
}

interface ZoomButtonProps {
  onClick: () => void;
}

export function ZoomButton({ onClick }: ZoomButtonProps) {
  return (
    <button
      className="art-control-btn zoom-btn text-btn"
      onClick={() => {
        onClick();
      }}
    >
      Reset Zoom
    </button>
  );
}

interface NumberInputProps {
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
}

export function NumberInput({
  value,
  setValue,
  min = 2,
  max = 8,
}: NumberInputProps) {
  const [inputNumChildren, setInputNumChildren] = useState(value.toString());
  const lastKeyPressed = useRef<string | null>(null);

  const applyNumChildren = () => {
    let num = parseInt(inputNumChildren, 10);
    if (isNaN(num)) {
      num = value; // revert to last valid value
    }
    num = Math.min(max, Math.max(min, num));
    setValue(num);
    setInputNumChildren(num.toString()); // update display after apply
  };

  return (
    <input
      className="input__box"
      type="number"
      min={min}
      max={max}
      value={inputNumChildren}
      onChange={(e) => {
        setInputNumChildren(e.target.value);
      }}
      onKeyDown={(e) => {
        lastKeyPressed.current = e.key;
        if (e.key === "Enter") {
          applyNumChildren();
        }
        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
      }}
      onBlur={applyNumChildren}
    />
  );
}

interface ShapeButtonProps {
  size: number;
  name: number;
  shape: number;
  colour: string;
  onClick: () => void;
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
      onClick={() => onClick()}
      className={`art-control-btn graphic-btn shape-btn${
        name == shape ? " active" : ""
      }`}
    >
      <canvas ref={canvasRef}></canvas>
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
      className={`art-control-btn graphic-btn motion-btn${
        name == func ? " active" : ""
      }`}
      style={{ height: size, width: size }}
    >
      <SpinArtPreview options={{ layers: 2, motionFunc: name, radius: 5 }} />
    </button>
  );
}

interface FilterButtonProps {
  name: string;
  filters: string[];
  onClick: () => void;
}

export function FilterButton({ name, filters, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={() => onClick()}
      className={`art-control-btn text-btn filter-btn${
        filters.includes(name) ? " active" : ""
      }`}
    >
      {name}
    </button>
  );
}
