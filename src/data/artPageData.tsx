import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  SpinArtInteractive,
  AVALIABLE_FILTERS,
  AVALIABLE_SHAPES,
  AVALIABLE_FUNCTIONS,
} from "../components/SpinArt";
import {
  ZoomButton,
  NumberInput,
  ShapeButton,
  FilterButton,
  SpinButton,
  ChaosButton,
} from "../components/tools/Buttons";

// Data for the Interactive Spin Art Page
export function spinArtData() {
  // Interactive Art States
  const [spinSpeed, setSpinSpeed] = useState(1);
  const [numChildren, setNumChildren] = useState(6);
  const [numLayers, setNumLayers] = useState(4);
  const [colour, setColour] = useState("#ffffff");
  const [filters, setActiveFilters] = useState<string[]>([]);
  const [shape, setShape] = useState(0);
  const [func, setFunc] = useState(0);
  const [zoom, triggerZoom] = useState(false);

  return {
    title: "Spin Art",
    art: (
      <SpinArtInteractive
        speed={spinSpeed}
        layers={numLayers}
        children={numChildren}
        shape={shape}
        func={func}
        colour={colour}
        filters={filters}
        onZoom={zoom}
      />
    ),
    controls: [
      {
        description: "Zoom:",
        input: <ZoomButton onClick={() => triggerZoom(!zoom)} />,
      },
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
              className="range-slider"
            />
            <span className="range-value">{spinSpeed.toFixed(1)}x</span>
          </>
        ),
      },
      {
        description: "Children:",
        input: (
          <NumberInput
            value={numChildren}
            setValue={setNumChildren}
            min={2}
            max={8}
          />
        ),
      },
      {
        description: "Layers:",
        input: (
          <NumberInput
            value={numLayers}
            setValue={setNumLayers}
            min={2}
            max={6}
          />
        ),
      },
      {
        description: "Shape Color:",
        input: (
          <div className="art-controls-btn-wrapper">
            <HexColorPicker
              color={colour}
              onChange={(c) => {
                setColour(c);
              }}
            />
            <div className="btn-wrapper">
              <ChaosButton
                name={"-1"}
                value={colour}
                type="colour-btn"
                onClick={() => {
                  setColour("-1");
                }}
              />
            </div>
          </div>
        ),
      },
      {
        description: "Shapes:",
        input: (
          <div className="art-controls-btn-wrapper">
            {AVALIABLE_SHAPES.map((avaliableShape) => (
              <div className="btn-wrapper">
                <ShapeButton
                  key={avaliableShape}
                  size={30}
                  name={avaliableShape}
                  shape={shape}
                  colour="white"
                  onClick={() => setShape(avaliableShape)}
                />
              </div>
            ))}
            <div className="btn-wrapper">
              <ChaosButton
                name={-1}
                value={shape}
                type="shape-btn"
                onClick={() => setShape(-1)}
              />
            </div>
          </div>
        ),
      },
      {
        description: "Motion:",
        input: (
          <div className="art-controls-btn-wrapper">
            {AVALIABLE_FUNCTIONS.map((avaliableFunc) => (
              <div className="btn-wrapper">
                <SpinButton
                  key={avaliableFunc}
                  size={50}
                  name={avaliableFunc}
                  func={func}
                  onClick={() => setFunc(avaliableFunc)}
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        description: "Filters:",
        input: (
          <div className="art-controls-btn-wrapper">
            {AVALIABLE_FILTERS.map((filterName) => (
              <div className="btn-wrapper">
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
              </div>
            ))}
          </div>
        ),
      },
    ],
  };
}
