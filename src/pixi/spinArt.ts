import { Application } from 'pixi.js';
import { nestCon } from './nestedContainer.js';

export function initSpinArt({ view, width, height, interactive = false }){
  (async () =>
  {
    const app = new Application();
    await app.init({ view: view, background: 'black', width: width, height: height });

    // document.body.appendChild(app.canvas);

    // Constants
    const LENGTH_RADIUS = 8;
    const NUM_LAYERS = 4;
    const NUM_CHILDREN = 6;

    // Root Container
    const rootNC = new nestCon(NUM_LAYERS, NUM_CHILDREN, 0, LENGTH_RADIUS);
    rootNC.container.x = width / 2;
    rootNC.container.y = height / 2;
    app.stage.addChild(rootNC.container);

    // Updates Canvas on time interval to create motion
    app.ticker.add((time) =>
    {
      rootNC.motion(0.001 * time.deltaTime, NUM_LAYERS)
    });
    
  })();
}
