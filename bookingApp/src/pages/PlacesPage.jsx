import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../components/AccountNav";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

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
              <Link
                to={"/account/places/" + place._id}
                className="flex cursor-pointer border bg-gray-100 p-2 rounded-2xl gap-2"
                key={idx}
              >
                <div className="w-32 h-32 bg-gray-300 grow-0 shrink-0">
                  {place.addedPhotos.length > 0 && (
                    <img
                      className="h-full"
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
            ))}
        </div>
      </div>
    </div>
  );
}
