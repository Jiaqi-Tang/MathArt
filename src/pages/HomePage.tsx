import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { featuredGalleries } from "../data/homePageData";
import { useTileObserver } from "./tools/functions";
import logo from "../assets/logo.png";

interface GalleryPreview {
  name: string;
  preview: ReactNode;
  link: string;
}

interface Prop {
  galleries: GalleryPreview[];
}

// Gallery Page Component
export default function HomePage() {
  useTileObserver();
  return <HomePageContent galleries={featuredGalleries.galleries} />;
}

// Component for Information Page
export function HomePageContent({ galleries }: Prop) {
  return (
    <main>
      <section className="home-section">
        <div className="section-content home-section-content">
          <img src={logo} alt="Math Art Logo" className="home-logo" />
          <h1 className="section-head">Welcome to Math Art!</h1>
          {/* <p className="section-subhead">
            This is a home for dynamic, interactive MathArt
          </p> */}
        </div>
      </section>
      <section className="featured featured-galleries">
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
