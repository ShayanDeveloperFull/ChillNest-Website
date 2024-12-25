import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../userContext";

export default function MainPage() {
  const { checkInDate, checkOutDate } = useContext(UserContext);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    // Fetch places from the API on component mount
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

        // Adjust comparison logic to allow overlapping date ranges
        return (
          placeCheckInDate <= selectedCheckOut &&
          placeCheckOutDate >= selectedCheckIn
        );
      });

      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places);
    }
  }, [checkInDate, checkOutDate, places]);

  return (
    <div className="mt-6 px-3 grid gap-x-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredPlaces.length > 0 &&
        filteredPlaces.map((place, idx) => (
          <Link to={"/place/" + place._id} key={idx}>
            {place.addedPhotos.length > 0 && (
              <div className="flex">
                <img
                  className="mb-2 object-cover aspect-square rounded-xl"
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

            {/* Display the Check-in and Check-out Dates */}
            <div className="mt-1">
              <span className="bg-black p-1 font-semibold text-white">
                {place.checkIn.Date} <span className="mr-2">&#8594;</span>
                {place.checkOut.Date}
              </span>
            </div>
          </Link>
        ))}
    </div>
  );
}
