import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// BEFORE you call `ReactDOM.createRoot(...).render(...)`
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("redirect");

if (redirectPath) {
  // This restores the full original path (e.g., /MathArt/gallery/spin)
  window.history.replaceState(null, '', decodeURIComponent(redirectPath));
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
