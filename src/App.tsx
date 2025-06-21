import "./css/global.css";

import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage.js";
import GalleryPage from "./pages/GalleryPage.js";
import ArtPage from "./pages/ArtPage";
import AboutPage from "./pages/AboutPage";

function AppContent() {
  const location = useLocation();

  // Hide header on art pages
  const hideHeader = location.pathname.startsWith("/art");

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery/:id" element={<GalleryPage />} />
        <Route path="/art/:id" element={<ArtPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

// App component
export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
