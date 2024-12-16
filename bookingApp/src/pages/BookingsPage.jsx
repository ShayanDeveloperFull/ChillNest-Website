import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImage from "../components/PlaceImage";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then(({ data }) => {
      setBookings(data);
    });
  }, []);

  async function deleteBooking(bookingID) {
    await axios.delete(`/user-bookings/${bookingID}`);
    setBookings([...bookings.filter((booking) => booking._id !== bookingID)]);
  }
  return (
    <div>
      <AccountNav />
      <div>
        {bookings.length > 0 &&
          bookings.map((booking, idx) => (
            <div
              className=" relative flex cursor-pointer border rounded-md bg-gray-100 p-2 mb-2 hover:bg-gray-300 transition-all duration-500 ease-in-out"
              key={idx}
            >
              <div className="w-60">
                <PlaceImage place={booking.place} />
              </div>
              <div className="flex-col items-start ml-2  w-full ">
                <h2 className="font-semibold py-3  ">{booking.place.title}</h2>
                {booking.checkInDate} → {booking.checkOutDate}
              </div>
              <button
                onClick={() => deleteBooking(booking._id)}
                className="absolute top-2 right-2 bg-red-700 text-white font-bold px-3 py-1 rounded-full hover:bg-white hover:text-red-700 border border-red-700 transition-all duration-200 ease-in-out active:scale-95"
              >
                X
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
