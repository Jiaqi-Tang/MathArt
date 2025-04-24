import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import InfoPage from "./pages/InfoPages.js";
import GalleryPage from "./pages/GalleryPage.js";

import { spinGalleryData } from "./data/galleries/spinGallery.js";
// import ArtPage from "./pages/ArtPage";
// import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <Router>
      <Header /> {/* Always visible */}
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route
          path="/gallery"
          element={
            <GalleryPage
              title={spinGalleryData.title}
              sections={spinGalleryData.sections}
            />
          }
        />
        {/*<Route path="/art/:id" element={<ArtPage />} />
        <Route path="/about" element={<AboutPage />} />*/}
      </Routes>
    </Router>
  );
}
