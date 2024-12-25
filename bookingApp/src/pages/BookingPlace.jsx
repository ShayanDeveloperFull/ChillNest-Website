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
      <div className="relative">
        <div className="absolute top-0 right-0 mr-1 mt-4">
          <div className="bg-white rounded-2xl shadow-lg p-3">
            <p className=" text-sm">
              <span className="bg-yellow-200 p-1 rounded-md font-bold">
                Contact:
              </span>{" "}
              <span className="text-sm">{booking.place.owner.name}</span>
              <span className="ml-3 text-xs">
                📞{booking.place.owner.phoneNumber}
              </span>
            </p>
          </div>
        </div>
        <PlaceDisplay place={booking.place} />
      </div>

      <PlaceInformation place={booking.place} />
    </div>
  );
}
