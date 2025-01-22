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
                  src={`https://nestwebsite-server.onrender.com/uploads/${link}`}
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
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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

          <label className=" aspect-square group cursor-pointer flex items-center justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 hover:shadow-[0_0_10px_rgba(0,0,255,0.5)] transition-shadow duration-300">
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
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Perks Section */}
        <h2 className="text-xl mt-4">Perks</h2>
        <p className="text-gray-500 text-sm"></p>
        <div className=" mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <label className="border p-4 flex gap-2 items-center cursor-pointer ">
            <img className="h-10 w-auto" src="/wifiSymbol.webp" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("WIFI")}
              name="WIFI"
              onChange={(e) => handleCheckBox(e)}
            />
            <p>WIFI</p>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/parkingIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("Parking")}
              name="Parking"
              onChange={(e) => handleCheckBox(e)}
            />
            <p>Parking</p>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/petIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("Pets")}
              name="Pets"
              onChange={(e) => handleCheckBox(e)}
            />
            <p>Pets</p>
          </label>
          <label className="border whitespace-nowrap p-4 flex gap-2 items-center cursor-pointer ">
            <img className="h-10 w-auto" src="/hotTubIcon.jpg" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("Hot Tub")}
              name="Hot Tub"
              onChange={(e) => handleCheckBox(e)}
            />
            <p>Hot Tub</p>
          </label>
          <label className="border p-4 whitespace-nowrap flex gap-2 items-center cursor-pointer">
            <img className="h-10 w-auto" src="/tvStreaming.webp" alt="" />
            <input
              type="checkbox"
              checked={perks.includes("TV Streaming Services")}
              name="TV Streaming Services"
              onChange={(e) => handleCheckBox(e)}
            />
            <p>TV Streaming Services</p>
          </label>
        </div>

        {/* Extra Info Section */}
        <h2 className="text-xl mt-4">Extra Info</h2>
        <p className="text-gray-500 text-sm">
          Special Rules, Appliance regulations, etc..
        </p>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        />

        {/* Check-In/Check-Out Section */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <h3 className="mt-2 -mb-1">Available From</h3>
            <input
              type="date"
              value={checkIn.Date}
              onChange={(e) => setCheckIn({ ...checkIn, Date: e.target.value })}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-In Time</h3>
            <input
              type="time"
              value={checkIn.Time}
              onChange={(e) => setCheckIn({ ...checkIn, Time: e.target.value })}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Available Until</h3>
            <input
              type="date"
              value={checkOut.Date}
              onChange={(e) =>
                setCheckOut({ ...checkOut, Date: e.target.value })
              }
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check-Out Time</h3>
            <input
              type="time"
              value={checkOut.Time}
              onChange={(e) =>
                setCheckOut({ ...checkOut, Time: e.target.value })
              }
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
          <button className="mt-3 primary transform active:scale-95 transition-transform duration-150">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
