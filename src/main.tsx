import ReactDOM from "react-dom/client";
import App from "./App";

// Ensures Correct nestation of relative paths on github pages
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("redirect");
if (redirectPath) {
  window.history.replaceState(null, '', decodeURIComponent(redirectPath));
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
