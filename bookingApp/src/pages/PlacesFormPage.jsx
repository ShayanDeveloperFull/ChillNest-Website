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
      });
      setRedirect(true);
    }
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

        <div className="grid gap-3 grid-cols-3 mt-2 md:grid-cols-4 lg:grid-cols-6 grid-a">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, idx) => (
              <img
                className="rounded-2xl object-fill"
                src={`http://localhost:4000/uploads/${link}`}
                alt=""
                key={idx}
              />
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
        </div>
        {/* Upload Button*/}
        <div>
          <button className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
