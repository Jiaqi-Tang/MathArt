// src/pages/GalleryPage.jsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface GallerySection {
  name: string;
  description: string;
  preview: ReactNode; 
  link?: string; 
}

// Whole gallery data object
export interface Prop {
  title: string;
  sections: GallerySection[];
}

export default function GalleryPage({ title, sections }: Prop) {
  return (
    <section className="everydayfeed">
      <div className="section-content">
      <h1 className="section-head">{title}</h1>
      <ul role="list" className="section-tiles">
      {sections.map((section, idx) => (
        <li key={idx} role="listitem" className="tile-item nr-scroll-animation item-hero">
        <div className="tile tile-hero small-loaded medium-loaded large-loaded" aria-label="">
          <div className="tile__media" aria-hidden="true">
            {section.preview}
          </div>
          <div className="tile__description" aria-hidden="true">
              <div className="tile__head">
                <h2>{section.name}</h2>
                <p>{section.description}</p>
              </div>
              {section.link && <a href={section.link ?? "/"} target="_blank" rel="noopener noreferrer">See full artwork</a>}
            </div>
        </div>
        </li>
      ))}
      </ul>
    </div>
    </section>
  );
}
