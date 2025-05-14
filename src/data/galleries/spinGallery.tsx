// src/data/galleries/spinGallery.js
import {SpinArtPreview} from "../../components/Preview";
import { NestConOptions } from "pixi/nestedContainer";

export const spinGalleryData = {
  title: "Spinning Art Series",
  sections: [
    {
      name: "Whirlwind",
      description: "A high-speed abstract circle dance.",
      preview: <SpinArtPreview/>,
      link: "/art/spin-default",
    },
  ],
};
