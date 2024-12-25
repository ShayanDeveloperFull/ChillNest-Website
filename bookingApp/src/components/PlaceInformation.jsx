export default function PlaceInformation({ place }) {
  return (
    <div>
      <div className="my-6 p-4 bg-white rounded-2xl shadow-lg w-[45%]">
        <h2 className="font-semibold text-2xl mb-2 border-b pb-2">
          <span className="bg-yellow-200 p-1 rounded-md">Description</span>
        </h2>
        <p className="text-gray-700 text-lg">{place.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Available From:
            </span>
            <span className="ml-3 mr-4 text-gray-600">
              📆 {place.checkIn.Date}
            </span>
            ⌚{place.checkIn.Time}
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Available Until
            </span>
            <span className="ml-6 mr-4 text-gray-600">
              📆 {place.checkOut.Date}
            </span>
            ⌚{place.checkOut.Time}
          </div>
          <div className="mb-4">
            <span className="bg-yellow-200 p-1 rounded-md font-bold text-lg">
              Guest Limit:
            </span>
            <span className="ml-10 text-gray-600">🧑 {place.maxGuests}</span>
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
            <p className="mt-1 text-gray-600 w-1/2">{place.extraInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
