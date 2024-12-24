import { useState } from "react";

export default function PlaceDisplay({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 text-white bg-black p-8 overflow-auto">
        <h2 className="text-2xl">
          <span className="bg-red-700 p-2 rounded-3xl">
            Photos of {place.title}
          </span>
        </h2>

        <button
          onClick={() => setShowAllPhotos(false)}
          className="fixed top-2 right-6 bg-red-700 text-white font-bold px-3 py-1 rounded-full hover:bg-white hover:text-red-700 border border-red-700 transition-all duration-200 ease-in-out active:scale-95"
        >
          X
        </button>

        <div className="mt-8 space-y-4">
          {place.addedPhotos.length > 0 &&
            place.addedPhotos.map((photo) => (
              <div key={photo} className="flex justify-center">
                <img
                  className="w-[1500px] rounded-2xl border border-yellow-400"
                  src={`http://localhost:4000/uploads/${photo}`}
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 bg-gray-100 -mx-8 p-8">
      {!place ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-3xl">{place.title}</h1>
          <a
            href={`https://maps.google.com/?q=${place.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-semibold underline my-2"
          >
            <div className="flex">
              <img
                className="flex w-10 h-full mr-2"
                src="/images/mapIcon.jpg"
                alt=""
              />
              {place.address}
            </div>
          </a>
          <div className="relative">
            <div className="grid gap-2 grid-cols-[2fr_1fr]">
              <div>
                {place.addedPhotos.length > 0 && (
                  <img
                    className="aspect-square object-cover h-[850px] w-full rounded-l-3xl"
                    src={`http://localhost:4000/uploads/${place.addedPhotos[0]}`}
                    alt=""
                  />
                )}
              </div>
              <div className="grid">
                {place.addedPhotos.length > 1 && (
                  <img
                    className="aspect-square object-cover h-[450px] w-full rounded-r-3xl"
                    src={`http://localhost:4000/uploads/${place.addedPhotos[1]}`}
                    alt=""
                  />
                )}
                <div className="overflow-hidden">
                  {place.addedPhotos.length > 2 && (
                    <img
                      className="aspect-square object-cover relative top-2 h-[400px] w-full rounded-r-3xl"
                      src={`http://localhost:4000/uploads/${place.addedPhotos[2]}`}
                      alt=""
                    />
                  )}
                </div>
              </div>
              <button
                className="flex absolute bottom-2 right-2 py-2 px-4 bg-gray-100 rounded-2xl border hover:bg-yellow-200 transform active:scale-95 transition-transform duration-150"
                onClick={() => {
                  setShowAllPhotos(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img
                  className="w-8 h-full mr-2"
                  src="/images/pictureIcon.png"
                  alt=""
                />
                <span className="relative top-1 font-semibold">
                  Show More Photos
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
