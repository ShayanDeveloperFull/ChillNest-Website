export default function PlaceInformation({ place }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 mb-6">
      <div className="p-6 bg-white rounded-2xl shadow-lg">
        <div className="mb-4">
          <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
            Check-In:
          </span>
          <span className="ml-8 text-gray-600">⌚ {place.checkIn}</span>
        </div>
        <div className="mb-4">
          <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
            Check-Out:
          </span>
          <span className="ml-4 text-gray-600">⌚ {place.checkOut}</span>
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
    </div>
  );
}
