import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PlaceDisplay from "../components/PlaceDisplay";
import PlaceInformation from "../components/PlaceInformation";

export default function BookingPlace() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then(({ data }) => {
        // Find the booking by ID
        const foundBooking = data.find((booking) => booking._id === id);
        setBooking(foundBooking);
      });
    }
  }, [id]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PlaceDisplay place={booking.place} />

      <div className="my-6 p-4 bg-white rounded-2xl shadow-lg w-[45%]">
        <h2 className="font-semibold text-2xl mb-2 border-b pb-2">
          <span className="bg-yellow-200 p-1 rounded-md">Description</span>
        </h2>
        <p className="text-gray-700 text-lg">{booking.place.description}</p>{" "}
      </div>
      <PlaceInformation place={booking.place} />
    </div>
  );
}
