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
    <main style={{ padding: "2rem" }}>
      <h1>{title}</h1>
      {sections.map((section, idx) => (
        <section key={idx} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div>
              {/* Placeholder or preview */}
              <section>{section.preview}</section>
            </div>
            <div>
              <h2>{section.name}</h2>
              <p>{section.description}</p>
              {section.link && <a href={section.link ?? "/"} target="_blank" rel="noopener noreferrer">See full artwork</a>}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
