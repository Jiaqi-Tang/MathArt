import { useState } from "react";
import { useParams } from "react-router-dom";
import SpinArtDefault from "../components/Canvases"

export default function ArtPage() {
    const { id } = useParams<{ id: string }>();

    const [spinSpeed, setSpinSpeed] = useState(1); // default 1x
    const [numChildren, setNumChildren] = useState(6); // default 5 children
    const [numLayers, setNumLayers] = useState(4); // default zoom 1x

    if (id === "spin-default") {
        return (
            <div style={{ padding: "2rem" }}>
              <h1>Spin Art Controls</h1>
      
              {/* Controls */}
              <div style={{ marginBottom: "2rem" }}>
                <label>
                  Spin Speed:
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={spinSpeed}
                    onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                  />
                  {spinSpeed}x
                </label>
                <br />
                <label>
                  Number of Children:
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={numChildren}
                    onChange={(e) => setNumChildren(parseInt(e.target.value))}
                  />
                </label>
                <br />
                <label>
                  Number of Layers:
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={numLayers}
                    onChange={(e) => setNumLayers(parseInt(e.target.value))}
                  />
                </label>
              </div>
      
              {/* Pass controls to SpinArt */}
              <SpinArtDefault
                interactive={true}
                spinSpeed={spinSpeed}
                numChildren={numChildren}
                numLayers={numLayers}
              />
            </div>
          );
    }else{
        return <div>Artwork Note Found.</div>;
    }
}
