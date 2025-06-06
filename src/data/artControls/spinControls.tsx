import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import SpinArtInteractive, {
  AVALIABLE_FILTERS,
  AVALIABLE_SHAPES,
} from "../../components/InteractiveArt";
import { ShapeButton, FilterButton } from "../../components/tools/Buttons";

// Control pannel for the Interactive Spin Art Page
export function spinArtControls() {
  // Refs
  const [spinSpeed, setSpinSpeed] = useState(1);
  const [numChildren, setNumChildren] = useState(6);
  const [numLayers, setNumLayers] = useState(4);
  const [colour, setColour] = useState("#ffffff");
  const [filters, setActiveFilters] = useState<string[]>([]);
  const [shape, setShape] = useState(0);

  // Button toggle
  const toggleFilter = (name: string) => {
    setActiveFilters((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  return {
    // Returns Components for controls
    title: "Spin Art",
    art: (
      <SpinArtInteractive
        speed={spinSpeed}
        layers={numLayers}
        children={numChildren}
        shape={shape}
        colour={colour}
        filters={filters}
      />
    ),
    controls: [
      {
        description: "Speed:",
        input: (
          <>
            <input
              type="range"
              min="0"
              max="4"
              step="0.1"
              value={spinSpeed}
              onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
            />{" "}
            {spinSpeed}x
          </>
        ),
      },
      {
        description: "Children:",
        input: (
          <input
            className="input__box"
            type="number"
            min="0"
            max="10"
            value={numChildren}
            onChange={(e) => setNumChildren(parseInt(e.target.value))}
          />
        ),
      },
      {
        description: "Layers:",
        input: (
          <input
            className="input__box"
            type="number"
            min="1"
            max="6"
            value={numLayers}
            onChange={(e) => setNumLayers(parseInt(e.target.value))}
          />
        ),
      },
      {
        description: "Shape Color:",
        input: <HexColorPicker color={colour} onChange={setColour} />,
      },
      {
        description: "Shapes:",
        input: (
          <div className="art-controls-btn-wrapper">
            {AVALIABLE_SHAPES.map((avaliableShape) => (
              <ShapeButton
                key={avaliableShape}
                size={30}
                name={avaliableShape}
                shape={shape}
                colour="white"
                onClick={() => setShape(avaliableShape)}
              />
            ))}
          </div>
        ),
      },
      {
        description: "Filters:",
        input: (
          <div className="art-controls-btn-wrapper">
            {AVALIABLE_FILTERS.map((filterName) => (
              <FilterButton
                key={filterName}
                name={filterName}
                filters={filters}
                onClick={() =>
                  setActiveFilters((prev) =>
                    prev.includes(filterName)
                      ? prev.filter((f) => f !== filterName)
                      : [...prev, filterName]
                  )
                }
              />
            ))}
          </div>
        ),
      },
    ],
  };
}
