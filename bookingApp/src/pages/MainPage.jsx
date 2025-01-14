import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../userContext";

export default function MainPage() {
  const { checkInDate, checkOutDate } = useContext(UserContext);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    axios
      .get("/places", {
        params: {
          checkInDate,
          checkOutDate,
        },
      })
      .then(({ data }) => {
        setFilteredPlaces(data);
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
      });
  }, [checkInDate, checkOutDate]);

  const message =
    checkInDate && checkOutDate
      ? filteredPlaces.length > 0
        ? `Great news! We found ${filteredPlaces.length} ${
            filteredPlaces.length === 1 ? "amazing place" : "beautiful places"
          } that match your selected dates!`
        : "Sorry, no places available for the selected dates ☹ Please try a different date range."
      : null;

  return (
    <div className="mt-6 px-3">
      {message && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">
            <span className="text-indigo-600 font-serif">{message}</span>
          </h2>
        </div>
      )}

      <div className="grid gap-x-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlaces.length > 0 &&
          filteredPlaces.map((place) => (
            <Link
              to={"/place/" + place._id}
              key={place._id}
              className="group block bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {place.addedPhotos.length > 0 && (
                <div className="flex">
                  <img
                    className="mb-2 object-cover aspect-square rounded-lg"
                    src={`https://nestwebsite-backend.onrender.com/uploads/${place.addedPhotos[0]}`}
                    alt={place.title}
                  />
                </div>
              )}
              <h2 className="font-bold text-gray-800 group-hover:text-indigo-600 mb-1">
                {place.address}
              </h2>
              <div className="mb-2">
                <h3 className="text-sm text-gray-500 group-hover:text-yellow-600">
                  {place.title}
                </h3>
              </div>
              <div>
                <p className="text-gray-500 text-xs italic">
                  {place.checkIn.Date} -- {place.checkOut.Date}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
