import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";

export default function BookingSection({ place }) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  let numNight = 0;
  if (checkInDate && checkOutDate) {
    numNight = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );
  }

  async function bookNow() {
    const { data } = await axios.post("/booking", {
      place: place._id,
      checkInDate,
      checkOutDate,
      name,
      mobile,
      price: numNight * place.price,
    });
    console.log(data);
  }

  return (
    <div className="p-6 bg-white text-black rounded-2xl shadow-lg flex flex-col justify-between">
      <div className="text-4xl font-bold text-white-800">
        <span className="bg-gray-100 p-2 rounded-lg">
          ${place.price}/night 🌙
        </span>
      </div>
      <label className="text-sm font-normal mt-4">
        <span className="font-semibold">When Do You Want To Check-In?</span>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300"
          style={{
            color: checkInDate ? "black" : "white",
          }}
        />
      </label>
      <label className="text-sm  mt-4">
        <span className="font-semibold">When Do You Want To Check-Out:</span>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300"
          style={{
            color: checkOutDate ? "black" : "white",
          }}
        />
      </label>
      {numNight > 0 && (
        <div className="flex space-x-4 mt-4">
          <label className="text-sm w-full">
            <span className="font-semibold">Your Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              style={{ color: name ? "black" : "white" }}
            />
          </label>

          <label className="text-sm w-full">
            <span className="font-semibold">Your Mobile:</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              style={{ color: mobile ? "black" : "white" }}
            />
          </label>
        </div>
      )}
      <div className="mt-2">
        {numNight > 0 && (
          <span className="font-semibold text-lg rounded-lg w-26 bg-red-500 text-white px-2 py-1">
            <span>Total: ${numNight * place.price}</span>
          </span>
        )}
      </div>
      <button
        onClick={bookNow}
        className="mt-5 font-semibold primary max-h transition-all duration-200 ease-in-out active:scale-95"
      >
        Book Now
      </button>
    </div>
  );
}
