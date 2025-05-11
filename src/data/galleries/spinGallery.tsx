// src/data/galleries/spinGallery.js
import SpinArtDefault, { SpinArtMoveOnly, SpinArtSpinOnly } from "../../components/Canvases";

export const spinGalleryData = {
  title: "Spinning Art Series",
  sections: [
    {
      name: "Whirlwind",
      description: "A high-speed abstract circle dance.",
      preview: <SpinArtDefault interactive={false} />,
      link: "/art/spin-default",
    },
    {
      name: "Spin Only",
      description: "Nested spinning containers and orbital motion.",
      preview: <SpinArtSpinOnly />,
    },
    {
      name: "Move Only",
      description: "Nested spinning containers and orbital motion.",
      preview: <SpinArtMoveOnly />,
    },
  ],
};
