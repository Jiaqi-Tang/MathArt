// src/data/galleries/spinGallery.js
import {SpinArtPreview} from "../../components/Preview";

export const spinGalleryData = {
  title: "Spin Art",
  featured: {
    name: "The Classic",
    description: "Ever wondered what nested spinning looks like but was unable to simulate it inside your head? Now you've seen it!\n\nThe Classic Spin Art is composed of two simple motions:\n- Each child spins around the parent at contant speed\n- Each child moves closer or further away from the parent at constant speed\n\n Putting these simple motions togther and nesting them within eachother give you -- The Classic Spin Art!",
    preview: <SpinArtPreview options={{motionFunc: 1}}/>,
    link: "/art/spin-classic",
  },
  gallery: [
    {
      name: "Lovely Dance",
      preview: <SpinArtPreview options={{shape: 4, colour: '#ff00ff'}}/>,
    },
    {
      name: "Glow with the Stars",
      preview: <SpinArtPreview options={{numChildren: 5, shape: 3, colour: 'yellow', filters: ["glow"]}}/>,
    },
    {
      name: "Clovers",
      preview: <SpinArtPreview options={{numChildren: 3, shape: 2, colour: '00aa00'}} filters={["bloom"]}/>,
    },
    {
      name: "Behind the Mist",
      preview: <SpinArtPreview options={{numChildren: 8, shape: 1, colour: 'ff0000'}} filters={["noise", "blur"]}/>,
    },
  ],
};
