import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then(({ data }) => {
      setPlace(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="mt-5 bg-gray-100 -mx-8 p-8  ">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl">{place.title}</h1>
          <a
            href={"https://maps.google.com/?q=" + place.address}
            target="_blank"
            className="block font-semibold underline my-2"
          >
            {place.address}
          </a>
          <div className="grid gap-2 grid-cols-[2fr_1fr]">
            <div>
              {place.addedPhotos.length > 0 && (
                <div>
                  <img
                    className="aspect-square object-cover h-[850px] w-full"
                    src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`}
                    alt=""
                  />
                </div>
              )}
            </div>
            <div className="grid">
              {place.addedPhotos.length > 0 && (
                <img
                  className="aspect-square object-cover h-[450px] w-full"
                  src={`http://localhost:4000/uploads/${place.addedPhotos[1]}`}
                  alt=""
                />
              )}
              <div className="overflow-hidden">
                {place.addedPhotos.length > 0 && (
                  <img
                    className="aspect-square object-cover relative top-2 h-[400px] w-full"
                    src={`http://localhost:4000/uploads/${place.addedPhotos[2]}`}
                    alt="Nudes??"
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
