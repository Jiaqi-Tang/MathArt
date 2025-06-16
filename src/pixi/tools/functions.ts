import * as PIXI from "pixi.js";

export function drawShape(
  g: PIXI.Graphics,
  shape: number,
  scale: number,
  colour: string
) {
  if (shape == -1) {
    shape = Math.floor(Math.random() * 5);
    console.log(shape);
  }
  switch (shape) {
    case 1: {
      // Rectangle
      g.clear()
        .rect(-scale, -scale, 2 * scale, 2 * scale)
        .fill(colour);
      break;
    }
    case 2: {
      // Triangle
      const cx = 0;
      const cy = 0;
      const side = 2 * scale;

      const height = (Math.sqrt(3) / 2) * side;

      const p1 = [cx, cy - (2 / 3) * height];
      const p2 = [cx - side / 2, cy + height / 3];
      const p3 = [cx + side / 2, cy + height / 3];

      g.clear()
        .poly([...p1, ...p2, ...p3])
        .fill(colour);
      break;
    }
    case 3: {
      // Star
      const cx = 0;
      const cy = 0;
      const points = 5;
      const outerRadius = 1.3 * scale;
      const innerRadius = 0.7 * scale;

      const vertices: number[] = [];
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        vertices.push(x, y);
      }

      g.clear().poly(vertices).fill(colour);

      break;
    }
    case 4: {
      // Heart, modified from https://codepen.io/jolx/pen/EVGyVP
      const cx = 0;
      const cy = 0;
      const xSize = 1.1 * scale;
      const ySize = 0.8 * scale;
      const ySize2 = 1 * scale;
      const ySize3 = 1.5 * scale;

      g.clear()
        .bezierCurveTo(cx, cy - ySize, cx - xSize, cy - ySize, cx - xSize, cy)
        .bezierCurveTo(cx - xSize, cy + ySize, cx, cy + ySize2, cx, cy + ySize3)
        .bezierCurveTo(cx, cy + ySize2, cx + xSize, cy + ySize, cx + xSize, cy)
        .bezierCurveTo(cx + xSize, cy - ySize, cx, cy - ySize, cx, cy)
        .fill(colour);
      break;
    }
    default: {
      // Circle
      g.clear().circle(0, 0, scale).fill(colour);
    }
  }
}
