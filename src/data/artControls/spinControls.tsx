import { useState } from "react";
import { HexColorPicker } from "react-colorful";

import SpinArtInteractive, {AVAIABLE_FILTERS} from "../../components/InteractiveArt";


export function spinArtControls(){
  const [spinSpeed, setSpinSpeed] = useState(1); 
  const [numChildren, setNumChildren] = useState(6); 
  const [numLayers, setNumLayers] = useState(4); 
  const [color, setColor] = useState("#ffffff");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (name: string) => {
    setActiveFilters((prev) =>
      prev.includes(name)
        ? prev.filter((f) => f !== name)
        : [...prev, name]
    );
  };

  return {
    title: "Spin Art Controls",
    art: <SpinArtInteractive speed={spinSpeed} layers={numLayers} children={numChildren} color={color} filters={activeFilters}/>,
    controls: [
      {
        description: "Speed:",
        input: <><input type="range" min="0" max="4" step="0.1" value={spinSpeed} onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}/> {spinSpeed}x</>
      },
      {
        description: "Children:",
        input: <input className="input__box" type="number" min="0" max="10" value={numChildren} onChange={(e) => setNumChildren(parseInt(e.target.value))}/>
      },
      {
        description: "Layers:",
        input: <input className="input__box" type="number" min="1" max="6" value={numLayers} onChange={(e) => setNumLayers(parseInt(e.target.value))}/>
      },
      {
        description: "Shape Color:",
        input: <HexColorPicker color={color} onChange={setColor} />
      },
      {
        description: "Filters:",
        input:<div>
                {AVAIABLE_FILTERS.map((filterName) => (
                  <button
                    key={filterName}
                    onClick={() => toggleFilter(filterName)}
                    style={{
                      margin: "4px",
                      background: activeFilters.includes(filterName) ? "#48f" : "#ccc",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer"
                    }}
                  >
                    {filterName}
                  </button>
                ))}
              </div>

      },
    ],
  };
}


