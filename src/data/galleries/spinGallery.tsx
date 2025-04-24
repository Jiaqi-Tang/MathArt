// src/data/galleries/spinGallery.js
import SpinArtBasic from "../../components/Canvases";

export const spinGalleryData = {
  title: "Spinning Art Series",
  sections: [
    {
      name: "Whirlwind",
      description: "A high-speed abstract circle dance.",
      preview: <SpinArtBasic interactive={false} />,
      link: "/art/spin-1",
    },
    {
      name: "Orbital Drift",
      description: "Nested spinning containers and orbital motion.",
      preview: <SpinArtBasic interactive={false} />,
      link: "/art/spin-2",
    },
  ],
};
