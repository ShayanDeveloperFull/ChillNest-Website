import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../components/AccountNav";

export default function UserPlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  async function deletePlace(placeId) {
    await axios.delete(`/user-places/${placeId}`);
    setPlaces([...places.filter((place) => place._id !== placeId)]);
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="bg-blue-600 text-white px-2 py-2 rounded-full"
          to={"/account/places/new"}
        >
          {"\u002B"} Add new place
        </Link>
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place, idx) => (
              <div
                className="relative flex cursor-pointer border bg-gray-100 p-2  mb-2"
                key={idx}
              >
                <Link
                  to={"/account/places/" + place._id}
                  className="flex flex-grow"
                >
                  <div className="w-60 bg-gray-300 grow-0 shrink-0">
                    {place.addedPhotos.length > 0 && (
                      <img
                        className="aspect-square object-cover rounded-lg"
                        src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="grow-0 shrink">
                    <h2 className="text-xl">{place.title}</h2>
                    <p className="text-sm mt-2 ">{place.description}</p>
                  </div>
                </Link>
                <button
                  onClick={() => deletePlace(place._id)}
                  className="absolute top-2 right-2 bg-red-700 text-white font-bold px-3 py-1 rounded-full"
                >
                  X
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
