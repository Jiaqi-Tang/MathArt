import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import InfoPage from "./pages/InfoPages.js";
import GalleryPage from "./pages/GalleryPage.js";
import ArtPage from "./pages/ArtPage";

import { spinGalleryData } from "./data/galleries/spinGallery.js";
// import AboutPage from "./pages/AboutPage";

function AppContent() {
  const location = useLocation();
  
  // Hide header if path starts with "/art"
  const hideHeader = location.pathname.startsWith("/art");

  return (
    <>
      {!hideHeader && <Header />}
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
        <Route path="/art/:id" element={<ArtPage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
