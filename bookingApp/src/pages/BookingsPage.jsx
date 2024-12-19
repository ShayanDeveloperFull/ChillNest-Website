import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImage from "../components/PlaceImage";
import { Link } from "react-router-dom";

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
            <Link
              to={`/account/bookings/${booking._id}`}
              className=" relative flex cursor-pointer border rounded-md bg-gray-100 p-2 mb-2 hover:bg-gray-300 transition-all duration-500 ease-in-out"
              key={idx}
            >
              <div className="w-60">
                <PlaceImage place={booking.place} />
              </div>
              <div className="flex-col items-start justify-center ml-2 w-full ">
                <h2 className="font-semibold text-lg py-3  ">
                  <span className="bg-red-300 p-1 rounded-md">
                    {booking.place.title}
                  </span>
                </h2>
                <div className="mt-4">
                  <div className="mb-1">
                    <span className="font-bold mr-6 p-1 bg-yellow-200">
                      Scheduled Stay:{" "}
                    </span>
                    <span className="italic">
                      {booking.checkInDate} → {booking.checkOutDate}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="font-bold p-1 rounded-md bg-yellow-200">
                      Price For The Stay:
                    </span>{" "}
                    $<span className="italic">{booking.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteBooking(booking._id)}
                className="absolute top-2 right-2 bg-red-700 text-white font-bold px-3 py-1 rounded-full hover:bg-white hover:text-red-700 border border-red-700 transition-all duration-200 ease-in-out active:scale-95"
              >
                X
              </button>
            </Link>
          ))}
      </div>
    </div>
  );
}
