import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { featuredGalleries } from "../data/galleries/featured";
import { useTileObserver } from "./tools/functions";
interface GalleryPreview {
  name: string;
  preview: ReactNode;
  link: string;
}

interface Prop {
  galleries: GalleryPreview[];
}

// Gallery Page Component
export default function InfoPage() {
  useTileObserver();
  return <InfoPageContent galleries={featuredGalleries.galleries} />;
}

// Component for Information Page
export function InfoPageContent({ galleries }: Prop) {
  return (
    <main>
      <section className="featured-display">
        <div className="section-content">
          <h1 className="section-head">Welcome to Math Art!</h1>
          <p>This is a place where mathematical art meets interactivity.</p>
        </div>
      </section>
      <section className="variations">
        <div className="section-content">
          <h1 className="section-head">Featured Galleries</h1>
          <ul role="list" className="section-tiles">
            {galleries.map((gallery, idx) => (
              <li
                key={idx}
                role="listitem"
                className="tile-item nr-scroll-animation item-2up"
                style={
                  { "--nr-animation-transform-y": "20%" } as React.CSSProperties
                }
              >
                <Link
                  to={gallery.link ?? "/"}
                  className="tile tile-2up small-loaded medium-loaded large-loaded"
                >
                  <div className="tile__media" aria-hidden="true">
                    {gallery.preview}
                  </div>
                  <div className="tile__description" aria-hidden="true">
                    <div className="tile__head">
                      <h2>{gallery.name}</h2>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
