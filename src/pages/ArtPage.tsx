import { useParams } from "react-router-dom";

import { ReactNode } from "react";
import spinArtControls from "../data/artControls/spinControls";

export interface Control {
  description: string;
  input: ReactNode; 
}

// Whole gallery data object
export interface Prop {
  title: string;
  art: ReactNode;
  controls: Control[];
}

export default function ArtPage() {
  const { id } = useParams<{ id: string }>();

  if (id === "spin-default") {
    const SAC = spinArtControls();
    return (
      <ArtPageContent 
        title={SAC.title}
        art={SAC.art}
        controls={SAC.controls}/>
    );
  }else{
    return <div>Artwork Note Found.</div>;
  }
}


function ArtPageContent({title, art, controls}: Prop) {
  return (
    <section className="featured-display">
      <div className="interactive">
      <div className="interactive__controls">
        <h1 className="section-head">{title}</h1>
        <div >
          {controls.map((control, idx) => (
          <div className="control" key={idx}>
          
            <div className="control__description">{control.description}</div>
            <div className="control__input">
              <label>{control.input}</label>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className="interactive__art">
        {art}
      </div>
      </div>
      </section>
    );
  }
