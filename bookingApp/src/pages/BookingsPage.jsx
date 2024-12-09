import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then(({ data }) => {
      setBookings(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings.length > 0 &&
          bookings.map((booking, idx) => (
            <div key={idx}>
              {booking.checkInDate} → {booking.checkOutDate}
            </div>
          ))}
      </div>
    </div>
  );
}
