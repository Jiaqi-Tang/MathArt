import { useEffect } from "react";

export function useTileObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate only once
          }
        }
      },
      {
        threshold: 0.1,
      }
    );

    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => observer.observe(tile));

    return () => observer.disconnect();
  }, []);
}
