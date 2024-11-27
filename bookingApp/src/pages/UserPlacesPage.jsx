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
          className="bg-blue-600 text-white px-2 py-2 rounded-full inline-block transform active:scale-95 transition-transform duration-150 "
          to={"/account/places/new"}
        >
          {"\u002B"} Add new place
        </Link>
        <div className="mt-4">
          {places.length > 0 &&
            places.map((place, idx) => (
              <div
                className="relative flex cursor-pointer border rounded-md bg-gray-100 p-2 mb-2 hover:bg-gray-300 transition-all duration-500 ease-in-out"
                key={idx}
              >
                <Link
                  to={"/account/places/" + place._id}
                  className="flex flex-grow "
                >
                  <div className="w-60 ">
                    {place.addedPhotos.length > 0 && (
                      <img
                        className="aspect-square object-cover "
                        src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`}
                        alt=""
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-start ml-2  w-full ">
                    <h2 className="font-semibold ">{place.title}</h2>
                    <p className="text-sm mt-2 ">{place.description}</p>
                  </div>
                </Link>
                <button
                  onClick={() => deletePlace(place._id)}
                  className="absolute top-2 right-2 bg-red-700 text-white font-bold px-3 py-1 rounded-full hover:bg-white hover:text-red-700 border border-red-700 transition-all duration-200 ease-in-out active:scale-95"
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
