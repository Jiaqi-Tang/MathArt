import { SpinArtPreview } from "../../components/Preview";

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
    preview: <SpinArtPreview options={{}} />,
    link: "/art/spin-classic",
  },
  gallery: [
    {
      name: "Lovely Dance",
      preview: (
        <SpinArtPreview
          options={{ shape: 4, motionFunc: 1, colour: "#ff00ff" }}
        />
      ),
    },
    {
      name: "Glow with the Stars",
      preview: (
        <SpinArtPreview
          options={{
            numChildren: 5,
            shape: 3,
            colour: "yellow",
            filters: ["glow"],
          }}
        />
      ),
    },
    {
      name: "Clovers",
      preview: (
        <SpinArtPreview
          options={{ numChildren: 3, shape: 2, colour: "00aa00" }}
          filters={["bloom"]}
        />
      ),
    },
    {
      name: "Behind the Mist",
      preview: (
        <SpinArtPreview
          options={{ numChildren: 8, shape: 1, colour: "ff0000" }}
          filters={["noise", "blur"]}
        />
      ),
    },
    {
      name: "The Absolute Chaos",
      preview: (
        <SpinArtPreview
          options={{
            numChildren: 7,
            shape: -1,
            motionFunc: 3,
            colour: "-1",
            filters: ["outline"],
          }}
        />
      ),
    },
  ],
};
