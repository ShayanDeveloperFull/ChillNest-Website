import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../userContext";

export default function MainPage() {
  const { checkInDate, checkOutDate } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
      setFilteredPlaces(data);
    });
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const filtered = places.filter((place) => {
        const placeCheckInDate = new Date(place.checkIn.Date);
        const placeCheckOutDate = new Date(place.checkOut.Date);
        const selectedCheckIn = new Date(checkInDate);
        const selectedCheckOut = new Date(checkOutDate);

        return (
          placeCheckInDate <= selectedCheckIn &&
          placeCheckOutDate >= selectedCheckOut
        );
      });

      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places);
    }
  }, [checkInDate, checkOutDate, places]);

  // Message only shows if both checkInDate and checkOutDate are selected
  const message =
    checkInDate && checkOutDate
      ? filteredPlaces.length > 0
        ? `Great news! We found ${filteredPlaces.length} ${
            filteredPlaces.length === 1 ? "amazing place" : "beautiful places"
          } that match your selected dates!`
        : "Sorry, no places available for the selected dates ☹ Please try a different date range"
      : null;

  return (
    <div className="mt-6 px-3">
      {/* Show message only if a date range is selected */}
      {message && (
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">
            <span className="text-indigo-600 font-serif">{message}</span>
          </h2>
        </div>
      )}

      <div className="grid gap-x-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlaces.length > 0 &&
          filteredPlaces.map((place, idx) => (
            <Link to={"/place/" + place._id} key={idx}>
              {place.addedPhotos.length > 0 && (
                <div className="flex">
                  <img
                    className="mb-2 object-cover aspect-square rounded-xl"
                    src={
                      `http://localhost:4000/uploads/` + place.addedPhotos[0]
                    }
                    alt=""
                  />
                </div>
              )}
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price} </span> per night
              </div>
              <div className="mt-1">
                <span className="bg-red-500 p-1">
                  {place.checkIn.Date} <span className="mr-2">&#8594;</span>
                  {place.checkOut.Date}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
