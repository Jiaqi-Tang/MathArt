import { useParams } from "react-router-dom";
import { ReactNode } from "react";
import { spinArtData } from "../data/artPageData";

interface Control {
  description: string;
  input: ReactNode;
}

interface Prop {
  title: string;
  art: ReactNode;
  controls: Control[];
}

// Art Page Component
export default function ArtPage() {
  const { id } = useParams<{ id: string }>();

  if (id === "spin-classic") {
    const SAC = spinArtData();
    return (
      <ArtPageContent title={SAC.title} art={SAC.art} controls={SAC.controls} />
    );
  } else {
    return <div>Artwork Note Found.</div>;
  }
}

// Helper function for better abstraction
function ArtPageContent({ title, art, controls }: Prop) {
  return (
    <section className="interactive">
      <div className="interactive__controls">
        <h1 className="section-head">{title}</h1>
        <div>
          {controls.map((control, idx) => (
            <div className="control" key={idx}>
              <div className="control__description">{control.description}</div>
              <div className="control__input">{control.input}</div>
            </div>
          ))}
        </div>
      </div>
      {art}
    </section>
  );
}
