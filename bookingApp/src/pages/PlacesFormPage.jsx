import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();

  //console.log(id);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCHeckIn] = useState("");
  const [checkOut, setCHeckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get("/places/" + id).then(({ data }) => {
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.addedPhotos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCHeckIn(data.checkIn);
      setCHeckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  async function addPhotoButton(e) {
    e.preventDefault();
    const { data } = await axios.post("/upload-by-link", { photoLink });
    console.log(data);
    setAddedPhotos([...addedPhotos, data]);
    setPhotoLink("");
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    const fileData = new FormData();

    for (let i = 0; i < files.length; i++) {
      fileData.append("photos", files[i]);
    }

    const response = await axios.post("/upload", fileData, {
      headers: { "Content-type": "multipart/form-data" },
    });
    const { data } = response;
    setAddedPhotos([...addedPhotos, ...data]);
  }

  function handleCheckBox(e) {
    const { checked, name } = e.target;
    if (checked) {
      setPerks([...perks, name]);
    } else {
      setPerks(perks.filter((perk) => perk !== name));
    }
  }

  async function savePlace(e) {
    e.preventDefault();

    if (id) {
      await axios.put("/updatePlaces", {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      setRedirect(true);
    }
  }

  function removePhoto(link) {
    setAddedPhotos([...addedPhotos.filter((photo) => photo !== link)]);
  }

  function mainPhoto(link) {
    setAddedPhotos([link, ...addedPhotos.filter((photo) => photo !== link)]);
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <form onSubmit={savePlace}>
        {/* Title Section */}
        <h2 className="text-xl mt-4">Title</h2>
        <p className="text-gray-500 text-sm">- For Your Desired Place</p>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Address Section */}
        <h2 className="text-xl mt-4">Address</h2>
        <p className="text-gray-500 text-sm">- Address To The Place</p>
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Photos Section */}
        <h2 className="text-xl mt-4">Photos</h2>
        <p className="text-gray-500 text-sm">- More = Better</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add using a Link..."
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
            className="flex-grow-0 w-3/4"
          />
          <button
            onClick={addPhotoButton}
            className=" bg-custom-blue w-28 text-white font-semibold  rounded-2xl whitespace-nowrap"
          >
            Add Photo
          </button>
        </div>

        <div className=" grid gap-3 grid-cols-3 mt-2 md:grid-cols-4 lg:grid-cols-6 grid-a">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, idx) => (
              <div className="relative" key={idx}>
                <img
                  className="w-full h-60 object-cover rounded-xl"
                  src={`http://localhost:4000/uploads/${link}`}
                  alt=""
                />
                <button
                  type="button"
                  onClick={() => {
                    removePhoto(link);
                  }}
                  className="absolute bottom-2 right-1 cursor-pointer text-white p-1 bg-black rounded-xl opacity-80"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hover:fill-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    mainPhoto(link);
                  }}
                  className="absolute top-2 left-1 cursor-pointer text-white p-1 bg-black rounded-xl "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={link === addedPhotos[0] ? "#FEF08A" : "none"} // Set yellow-100 hex color
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hover:fill-[#FEF08A]" // Use same yellow-100 color for hover state
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </button>
              </div>
            ))}

          {/* Photo File Upload */}

          <label className="group cursor-pointer flex items-center justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 hover:shadow-[0_0_10px_rgba(0,0,255,0.5)] transition-shadow duration-300">
            <input
              type="file"
              className="hidden"
              onChange={uploadPhoto}
              multiple
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 transition-colors duration-300 group-hover:stroke-blue-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
          </label>
        </div>

        {/* Description Section */}
        <h2 className="text-xl mt-4">Description</h2>
        <p className="text-gray-500 text-sm">- Description of the place</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Perks Section */}
        <h2 className="text-xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm">
          - Select All The Perks of Your Place
        </p>
        <div className=" mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <label className="border p-4 flex gap-2 items-center cursor-pointer ">
            <img className="h-10 w-auto" src="/images/wifiSymbol.webp" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("wifi")}
              name="wifi"
              onChange={(e) => handleCheckBox(e)}
            />
            <span>Wifi</span>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/images/parkingIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("parking")}
              name="parking"
              onChange={(e) => handleCheckBox(e)}
            />
            <span>Parking </span>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/images/petIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("pets")}
              name="pets"
              onChange={(e) => handleCheckBox(e)}
            />
            <span>Pets</span>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/images/hotTubIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("hotTub")}
              name="hotTub"
              onChange={(e) => handleCheckBox(e)}
            />
            <span>Hot Tub</span>
          </label>
          <label className="border p-4 whitespace-nowrap flex gap-2 items-center cursor-pointer">
            <img
              className="h-10 w-auto"
              src="/images/tvStreaming.webp"
              alt=""
            />
            <input
              type="checkbox"
              checked={perks.includes("TVStreamingServices")}
              name="TVStreamingServices"
              onChange={(e) => handleCheckBox(e)}
            />
            <span>TV Streaming Services</span>
          </label>
        </div>

        {/* Extra Info Section */}
        <h2 className="text-xl mt-4">Extra Info</h2>
        <p className="text-gray-500 text-sm">-House Rules, etc</p>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />

        {/* CheckIn CheckOut Guests Section */}
        <h2 className="text-xl mt-4">checkIn & checkOut, Max Guests</h2>
        <p className="text-gray-500 text-sm">
          -Add the checkIn time and checkOut time and the number of guests.
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          {/* checkIn Section */}
          <div>
            <h3 className="mt-2 -mb-1">CheckIn Time</h3>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCHeckIn(e.target.value)}
            />
          </div>
          {/* checkOut Section */}
          <div>
            <h3 className="mt-2 -mb-1">CheckOut Time</h3>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCHeckOut(e.target.value)}
              placeholder=""
            />
          </div>

          {/* Guests Section */}
          <div>
            <h3 className="mt-2 -mb-1">Max Number of Guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price/Night</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        {/* Upload Button*/}
        <div>
          <button className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
