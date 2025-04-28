import { useParams } from "react-router-dom";
import SpinArtDefault from "../components/Canvases"

export default function ArtPage() {
    const { id } = useParams<{ id: string }>();

    if (id === "spin-default") {
        return <SpinArtDefault interactive={true} />;
    }else{
        return <div>Artwork Note Found.</div>;
    }
}
