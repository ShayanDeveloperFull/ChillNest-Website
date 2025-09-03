const express = require('express');
const cors = require('cors');
require('dotenv').config();
const User = require("./models/User.js");
const Place = require("./models/place.js");
const Booking = require("./models/Booking.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const validUrl = require("valid-url");
const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(cors({
  credentials: true,
  origin: ["http://localhost:5173", "https://chillnestweb.onrender.com"]
}));

const bcryptPassword = bcrypt.genSaltSync(10);
const jwtAccess = process.env.JWT_SECRET;

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

app.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!email) return res.status(400).json("Email Address Needs A Valid Input");

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptPassword),
      phoneNumber
    });
    res.json(userDoc);
  } catch (err) {
    res.status(409).json(err);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) return res.status(401).json("Email not registered");

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(404).json("Password does not match");

  const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtAccess);
  res.json({ token, user: userDoc });
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, jwtAccess);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/profile", authMiddleware, async (req, res) => {
  const userDoc = await User.findById(req.user.id);
  res.json(userDoc);
});

app.post("/upload-by-link", async (req, res) => {
  const { photoLink } = req.body;
  if (!photoLink) return res.status(400).json("Image Address Is Required");
  if (!validUrl.isUri(photoLink)) return res.status(400).json("Invalid URL provided");

  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: photoLink,
    dest: __dirname + "/uploads/" + newName
  });
  res.json(newName);
});

const photosMiddleWare = multer({ dest: "uploads" });

app.post("/upload", photosMiddleWare.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", authMiddleware, async (req, res) => {
  const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  const placeDoc = await Place.create({
    owner: req.user.id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  });
  res.json({ placeDoc });
});

app.get("/user-places", authMiddleware, async (req, res) => {
  res.json(await Place.find({ owner: req.user.id }));
});

app.delete("/user-places/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  res.status(200).json("Place deleted successfully");
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id).populate("owner");
  res.json(place);
});

app.put("/updatePlaces", authMiddleware, async (req, res) => {
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  const placeDoc = await Place.findById(id);
  if (req.user.id === placeDoc.owner.toString()) {
    placeDoc.set({ title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price });
    placeDoc.save();
    res.json("ok");
  } else {
    res.status(403).json("Unauthorized");
  }
});

app.get("/places", async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;
  let filteredPlaces = await Place.find();

  if (checkInDate && checkOutDate) {
    const selectedCheckIn = new Date(checkInDate);
    const selectedCheckOut = new Date(checkOutDate);

    filteredPlaces = filteredPlaces.filter((place) => {
      const placeCheckInDate = new Date(place.checkIn.Date);
      const placeCheckOutDate = new Date(place.checkOut.Date);

      return (
        (selectedCheckIn <= placeCheckOutDate && selectedCheckOut >= placeCheckInDate) &&
        (selectedCheckIn >= placeCheckInDate && selectedCheckOut <= placeCheckOutDate) &&
        (selectedCheckOut <= placeCheckOutDate && selectedCheckIn >= placeCheckInDate)
      );
    });
  }

  res.json(filteredPlaces);
});

app.post("/booking", authMiddleware, async (req, res) => {
  const { place, checkInDate, checkOutDate, name, mobile, price } = req.body;
  if (!place || !checkInDate || !checkOutDate || !name || !mobile || !price)
    return res.status(400).json({ error: "Missing required fields" });

  const bookingDoc = await Booking.create({
    place,
    user: req.user.id,
    checkInDate,
    checkOutDate,
    name,
    mobile,
    price
  });
  res.json(bookingDoc);
});

app.get("/bookings", authMiddleware, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({ path: "place", populate: { path: "owner" } });
  res.json(bookings);
});

app.delete("/user-bookings/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndDelete(id);
  res.status(200).json("Booking deleted successfully");
});

app.listen(5000);
