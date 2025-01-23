import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState({ Date: "", Time: "" });
  const [checkOut, setCheckOut] = useState({ Date: "", Time: "" });
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
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  async function addPhotoButton(e) {
    e.preventDefault();
    const { data } = await axios.post("/upload-by-link", { photoLink });
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

    if (addedPhotos.length === 0) {
      alert("Please upload at least one photo before saving.");
      return;
    }

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
        <h2 className="text-xl mt-4">Name of Place</h2>
        <input
          type="text"
          placeholder="What Is The Name of Your Place?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Address Section */}
        <h2 className="text-xl mt-4">Address</h2>
        <input
          type="text"
          placeholder="Enter Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Photos Section */}
        <h2 className="text-xl mt-4">Photos</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Get an Image Address Link"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
            className="flex-grow-0 w-3/4"
          />
          <button
            onClick={addPhotoButton}
            className=" bg-custom-blue w-28 text-white font-semibold  rounded-2xl whitespace-nowrap transform active:scale-95 transition-transform duration-150"
            required
          >
            Add Photo
          </button>
        </div>

        <div className=" grid gap-3 grid-cols-3 mt-2 md:grid-cols-4 lg:grid-cols-6 grid-a">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link, idx) => (
              <div className="relative" key={idx}>
                <img
                  className="aspect-square w-full object-cover rounded-xl"
                  src={`https://nestwebsite-backend.onrender.com/${
                    link.startsWith("uploads/") ? link : `uploads/${link}`
                  }`}
                  alt="err"
                />

                <button
                  type="button"
                  onClick={() => {
                    removePhoto(link);
                  }}
                  className="absolute bottom-2 right-1 cursor-pointer text-white p-1 bg-black rounded-xl opacity-80 transform active:scale-95 transition-transform duration-150"
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    mainPhoto(link);
                  }}
                  className="absolute top-2 left-1 cursor-pointer text-white p-1 bg-black rounded-xl  transform active:scale-95 transition-transform duration-150 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={link === addedPhotos[0] ? "#FEF08A" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 hover:fill-[#FEF08A]"
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
          <label className="w-full h-full text-center cursor-pointer relative rounded-xl overflow-hidden">
            <input
              type="file"
              multiple
              onChange={uploadPhoto}
              className="w-full h-full opacity-0 absolute top-0 left-0"
            />
            <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2 2m0 0l2-2m-2 2V3m10 12l2 2m0 0l2-2m-2 2V3"
                />
              </svg>
            </div>
          </label>
        </div>

        {/* Description Section */}
        <h2 className="text-xl mt-4">Description</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe Your Place"
        />

        {/* Perks Section */}
        <h2 className="text-xl mt-4">Perks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={perks.includes("wifi")}
              name="wifi"
              onChange={handleCheckBox}
            />
            Wifi
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={perks.includes("tv")}
              name="tv"
              onChange={handleCheckBox}
            />
            TV
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={perks.includes("airConditioner")}
              name="airConditioner"
              onChange={handleCheckBox}
            />
            Air Conditioner
          </label>
        </div>

        {/* Extra Info Section */}
        <h2 className="text-xl mt-4">Extra Information</h2>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          rows={4}
          placeholder="Extra Information"
        />

        {/* Check-in/Check-out Section */}
        <h2 className="text-xl mt-4">Check-In & Check-Out</h2>
        <div className="flex gap-4">
          <div>
            <label>Check-In Date</label>
            <input
              type="date"
              value={checkIn.Date}
              onChange={(e) => setCheckIn({ ...checkIn, Date: e.target.value })}
            />
            <label>Time</label>
            <input
              type="time"
              value={checkIn.Time}
              onChange={(e) => setCheckIn({ ...checkIn, Time: e.target.value })}
            />
          </div>
          <div>
            <label>Check-Out Date</label>
            <input
              type="date"
              value={checkOut.Date}
              onChange={(e) =>
                setCheckOut({ ...checkOut, Date: e.target.value })
              }
            />
            <label>Time</label>
            <input
              type="time"
              value={checkOut.Time}
              onChange={(e) =>
                setCheckOut({ ...checkOut, Time: e.target.value })
              }
            />
          </div>
        </div>

        {/* Max Guests and Price Section */}
        <h2 className="text-xl mt-4">Max Guests and Price</h2>
        <input
          type="number"
          placeholder="Max Guests"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price per Night"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-custom-blue text-white p-2 rounded-2xl transform active:scale-95 transition-transform duration-150 mt-4"
        >
          Save Place
        </button>
      </form>
    </div>
  );
}
