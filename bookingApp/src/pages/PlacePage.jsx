import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
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
  const [errorMessage1, setErrorMessage1] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const navigate = useNavigate();

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
    try {
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
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage1(error.response.data.message);
      } else {
        setErrorMessage2(error.response.data.message);
      }
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-0 md:pb-4">
      <div>
        <PlaceDisplay place={place} />
      </div>

      <div className="mt-6 mb-3 md:mb-6 p-4 bg-white rounded-2xl shadow-lg w-full md:w-[45%]">
        <h2 className="font-semibold text-2xl mb-2 border-b pb-2">
          <span className="bg-yellow-200 p-1 rounded-md">Description</span>
        </h2>
        <p className="text-gray-700 text-lg">{place.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-3 md:mb-6">
        {/* Left Section */}
        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg">
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-base md:text-lg">
              Available From:
            </span>
            <span className="ml-2 md:ml-3 mr-2 md:mr-4 text-gray-600 text-sm md:text-base break-words">
              📆 {place.checkIn.Date}
            </span>
            <span className="text-sm md:text-base">⌚{place.checkIn.Time}</span>
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-base md:text-lg">
              Available Until:
            </span>
            <span className="ml-2 md:ml-4 mr-2 md:mr-4 text-gray-600 text-sm md:text-base break-words">
              📆 {place.checkOut.Date}
            </span>
            <span className="text-sm md:text-base">
              ⌚{place.checkOut.Time}
            </span>
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 mr-4 md:mr-8 p-1 rounded-md font-bold text-base md:text-lg">
              Guest Limit:
            </span>
            <span className="ml-2 text-gray-600 text-sm md:text-base">
              🧑 {place.maxGuests}
            </span>
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-base md:text-lg">
              Perks:
            </span>
            <ul className="list-disc ml-5 md:ml-6 text-gray-600 mt-2 text-sm md:text-base">
              {place.perks &&
                place.perks.map((perk, idx) => (
                  <li key={idx} className="mb-1">
                    {perk}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mb-3">
            <span className="bg-yellow-200 p-1 rounded-md font-semibold text-lg md:text-xl mb-2">
              Extra Info:
            </span>
            <p className="mt-1 text-gray w-full md:w-1/2 text-sm md:text-base break-words">
              {place.extraInfo}
            </p>
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

      {/* Error Message */}
      {errorMessage1 && (
        <div className="text-center">
          <span
            className="font-bold text-red-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            {errorMessage1}
          </span>
        </div>
      )}
      {errorMessage2 && (
        <div className="text-center">
          <span className="font-bold text-red-500">{errorMessage2}</span>
        </div>
      )}

      <button
        onClick={bookNow}
        className="font-semibold primary max-h transition-all duration-200 ease-in-out active:scale-95 mb-0 block"
      >
        Book Now
      </button>
    </div>
  );
}
