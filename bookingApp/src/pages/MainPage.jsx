import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MainPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces([...data]);
      //console.log(places);
    });
  }, []);
  return (
    <div className="mt-6 px-3 grid gap-x-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
      {places.length > 0 &&
        places.map((place, idx) => (
          <Link to={"/place/" + place._id} key={idx}>
            {place.addedPhotos.length > 0 && (
              <div className="flex">
                <img
                  className="mb-2 rounded-2xl object-cover aspect-square"
                  src={`http://localhost:4000/uploads/` + place.addedPhotos[0]}
                  alt=""
                />
              </div>
            )}
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">${place.price} </span> per night
            </div>
          </Link>
        ))}
    </div>
  );
}
