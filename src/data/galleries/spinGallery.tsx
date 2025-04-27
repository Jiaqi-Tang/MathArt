// src/data/galleries/spinGallery.js
import SpinArtDefault, { SpinArtMoveOnly, SpinArtSpinOnly } from "../../components/Canvases";

export const spinGalleryData = {
  title: "Spinning Art Series",
  sections: [
    {
      name: "Whirlwind",
      description: "A high-speed abstract circle dance.",
      preview: <SpinArtDefault interactive={false} />,
      link: "/art/spin-1",
    },
    {
      name: "Spin Only",
      description: "Nested spinning containers and orbital motion.",
      preview: <SpinArtSpinOnly interactive={false} />,
      link: "/art/spin-2",
    },
    {
      name: "Move Only",
      description: "Nested spinning containers and orbital motion.",
      preview: <SpinArtMoveOnly interactive={false} />,
      link: "/art/spin-2",
    },
  ],
};
