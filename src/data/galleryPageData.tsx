import { SpinArtPreview } from "../components/SpinArt";

// Content for Spin Art Gallery Page
export const spinGalleryData = {
  title: "Spin Art",
  featured: {
    name: "The Classic",
    description: (
      <>
        <p>This Gallery explores the Artistic potential of nested spining</p>
        <p>The Classic Spin Art is composed of two simple motions:</p>
        <ul>
          <li>Each child spins around the parent at contant speed</li>
          <li>
            Each child moves closer or further away from the parent at constant
            speed
          </li>
        </ul>
        <p>
          Putting these simple motions togther and nesting them within eachother
          give you -- The Classic Spin Art!
        </p>
      </>
    ),
    preview: <SpinArtPreview />,
    link: "/art/spin-classic",
  },
  gallery: [
    {
      name: "Lovely Dance",
      preview: <SpinArtPreview shape_num={4} motionFunc={1} colour="#ff00ff" />,
    },
    {
      name: "Glow with the Stars",
      preview: (
        <SpinArtPreview
          numChildren={5}
          shape_num={3}
          colour="yellow"
          filters={["glow"]}
        />
      ),
    },
    {
      name: "Clovers",
      preview: (
        <SpinArtPreview
          numChildren={3}
          shape_num={2}
          colour="00aa00"
          filters={["bloom"]}
        />
      ),
    },
    {
      name: "Behind the Mist",
      preview: (
        <SpinArtPreview
          numChildren={8}
          shape_num={1}
          colour="ff0000"
          filters={["noise", "blur"]}
        />
      ),
    },
    {
      name: "The Absolute Chaos",
      preview: (
        <SpinArtPreview
          numChildren={7}
          shape_num={-1}
          motionFunc={3}
          colour="-1"
          filters={["outline"]}
        />
      ),
    },
  ],
};
