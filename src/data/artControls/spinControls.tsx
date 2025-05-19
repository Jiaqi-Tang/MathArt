import { useState } from "react";
import SpinArtInteractive from "../../components/InteractiveArt";


export default function spinArtControls(){
  const [spinSpeed, setSpinSpeed] = useState(1); 
  const [numChildren, setNumChildren] = useState(6); 
  const [numLayers, setNumLayers] = useState(4); 

  return {
    title: "Spin Art Controls",
    art: <SpinArtInteractive interactive={true} spinSpeed={spinSpeed} numChildren={numChildren} numLayers={numLayers}/>,
    controls: [
      {
        description: "Spin Speed:",
        input: <><input type="range" min="0" max="4" step="0.1" value={spinSpeed} onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}/> {spinSpeed}x</>
      },
      {
        description: "Number of Children:",
        input: <input className="input__box" type="number" min="0" max="10" value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))}/>
      },
      {
        description: "Number of Layers:",
        input: <input className="input__box" type="number" min="1" max="6" value={numLayers} onChange={(e) => setNumLayers(parseInt(e.target.value))}/>
      },
    ],
  };
}