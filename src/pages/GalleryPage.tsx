import { useParams } from "react-router-dom";
import { ReactNode } from "react";

import { spinGalleryData } from "../data/galleries/spinGallery.js";

interface Featured {
  name: string;
  description: ReactNode;
  preview: ReactNode; 
  link: string; 
}

interface ArtDisplay {
  name: string;
  preview: ReactNode; 
}

// Whole gallery data object
interface Prop {
  title: string;
  featured: Featured;
  gallery: ArtDisplay[];
}


export default function GalleryPage(){
  const { id } = useParams<{ id: string }>();

  if (id === "spin") {
    const SGD = spinGalleryData;
    return (
      <GalleryPageContent 
        title={SGD.title}
        featured={SGD.featured}
        gallery={SGD.gallery}/>
    );
  }else{
    return <div>Artwork Note Found.</div>;
  }
}


function GalleryPageContent({ title, featured, gallery }: Prop) {
  return (
    <>
    <section className="featured-display">
      <div className="section-content">
        <h1 className="section-head">{title}</h1>
        <ul role="list" className="section-tiles">
          <li key="1" role="listitem" className="tile-item nr-scroll-animation item-hero">
            <div className="tile tile-hero small-loaded medium-loaded large-loaded" aria-label="">
              <div className="tile__media" aria-hidden="true">
                {featured.preview}
              </div>
              <div className="tile__description" aria-hidden="true">
                <div className="tile__head">
                  <h2>{featured.name}</h2>
                  {featured.description}
                </div>
                <a href={featured.link ?? "/"} className="button-art-page-link" target="_blank" rel="noopener noreferrer">Customize this piece</a>
                </div>
            </div>
          </li>
        </ul>
    </div>
    </section>
    <section className="variations">
      <div className="section-content">
        <h1 className="section-head">Variations</h1>
        <ul role="list" className="section-tiles">
          {gallery.map((artpiece, idx) => (
          <li key={idx} role="listitem" className="tile-item nr-scroll-animation item-2up">
            <div className="tile tile-2up small-loaded medium-loaded large-loaded" aria-label="">
              <div className="tile__media" aria-hidden="true">
                {artpiece.preview}
              </div>
              <div className="tile__description" aria-hidden="true">
                <div className="tile__head">
                  <h2>{artpiece.name}</h2>
                </div>
              </div>
            </div>
          </li>
          ))}
        </ul>
    </div>
    </section>
    </>
  );
}
