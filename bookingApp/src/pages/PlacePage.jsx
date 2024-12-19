import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import BookingSection from "../components/BookingSection";
import { differenceInCalendarDays } from "date-fns";
import PlaceDisplay from "../components/PlaceDisplay";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then(({ data }) => {
      setPlace(data);
      setLoading(false);
    });
  }, [id]);

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
    const bookingID = data._id;
    setRedirect(`/account/bookings/${bookingID}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <PlaceDisplay place={place} />
      </div>

      {/* Description */}
      <div className="my-6 p-4 bg-white rounded-2xl shadow-lg w-[45%]">
        <h2 className="font-semibold text-2xl mb-2 border-b pb-2">
          <span className="bg-yellow-200 p-1 rounded-md">Description</span>
        </h2>
        <p className="text-gray-700 text-lg">{place.description}</p>
      </div>

      {/* Grid Layout for Info */}
      <div className="grid grid-cols-[auto_1fr] gap-6 mb-6 ">
        {/* Left Section */}
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Check-In:
            </span>
            <span className="ml-8 mr-4 text-gray-600">
              📆 {place.checkIn.Date}
            </span>
            ⌚{place.checkIn.Time}
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Check-Out:
            </span>
            <span className="ml-4 mr-4 text-gray-600">
              📆 {place.checkOut.Date}
            </span>
            ⌚{place.checkOut.Time}
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Guest Limit:
            </span>
            <span className="ml-2 text-gray-600">🧑 {place.maxGuests}</span>
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Perks:
            </span>
            <ul className="list-disc ml-6 text-gray-600 mt-2">
              {place.perks &&
                place.perks.map((perk, idx) => (
                  <li key={idx} className="mb-1">
                    {perk}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <span className="bg-yellow-200 p-1 rounded-md font-semibold text-xl mb-2">
              Extra Info:
            </span>
            <p className="mt-1 text-gray-600">{place.extraInfo}</p>
          </div>
        </div>

        {/* Right Section */}
        <BookingSection
          place={place}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          name={name}
          mobile={mobile}
          setCheckInDate={setCheckInDate}
          setCheckOutDate={setCheckOutDate}
          setName={setName}
          setMobile={setMobile}
          numNight={numNight}
        />
      </div>

      <button
        onClick={bookNow}
        className="font-semibold primary max-h transition-all duration-200 ease-in-out active:scale-95"
      >
        Book Now
      </button>
    </div>
  );
}
