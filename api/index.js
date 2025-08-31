const express = require('express');
const cors = require('cors');
require('dotenv').config();
const User = require("./models/User.js");
const Place = require("./models/place.js");
const Booking = require("./models/Booking.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const imageDownloader = require("image-downloader");
const validUrl = require("valid-url");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();

// ====== CONFIG ======
const bcryptPassword = bcrypt.genSaltSync(10);
const jwtAccess = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

// ====== MIDDLEWARE ======
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:5173",
    "https://chillnestweb.onrender.com"
  ],
}));

app.use(cookieParser());

// ====== DATABASE ======
mongoose.connect(process.env.MONGO_URL);

// ====== AUTH HELPER ======
function setAuthCookie(res, token) {
  res.cookie("blue", token, {
    httpOnly: true,
    secure: isProduction,  // only true in production
    sameSite: isProduction ? "None" : "Lax", // Lax for localhost dev
  });
}

// ====== ROUTES ======

// Register
app.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;
  if (!email) {
    return res.status(400).json("Email Address Needs A Valid Input");
  }
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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    return res.status(401).json("This Email Address Has Not Been Registered");
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(404).json("Password Does Not Match");
  }

  jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtAccess, {}, (err, token) => {
    if (err) throw err;
    setAuthCookie(res, token);
    res.json(userDoc);
  });
});

// Profile
app.get("/profile", (req, res) => {
  const { blue } = req.cookies;
  if (!blue) return res.json(null);

  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json("Invalid token");
    const { name, email, phoneNumber, _id } = await User.findById(user.id);
    res.json({ name, email, phoneNumber, _id });
  });
});

// Logout
app.post("/logout", (req, res) => {
  res.cookie("blue", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 0
  }).json(true);
});

// Upload by link
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

// Upload files
const photosMiddleWare = multer({ dest: "uploads" });
app.post("/upload", photosMiddleWare.array("photos", 100), (req, res) => {
  const uploadedFiles = req.files.map(file => {
    const { path, originalname } = file;
    const ext = originalname.split(".").pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
    return newPath.replace("uploads\\", "");
  });
  res.json(uploadedFiles);
});

// Create place
app.post("/places", (req, res) => {
  const { blue } = req.cookies;
  const {
    title, address, addedPhotos, description, perks, extraInfo,
    checkIn, checkOut, maxGuests, price
  } = req.body;

  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json("Invalid token");
    const placeDoc = await Place.create({
      owner: user.id, title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json({ placeDoc });
  });
});

// User places
app.get("/user-places", (req, res) => {
  const { blue } = req.cookies;
  if (!blue) return res.status(401).json([]);
  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json([]);
    res.json(await Place.find({ owner: user.id }));
  });
});

// Delete place
app.delete("/user-places/:id", async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  res.status(200).json("Place deleted successfully");
});

// Get single place
app.get("/places/:id", async (req, res) => {
  const place = await Place.findById(req.params.id).populate("owner");
  res.json(place);
});

// Update place
app.put("/updatePlaces", async (req, res) => {
  const { blue } = req.cookies;
  const { id, title, address, addedPhotos, description, perks,
    extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json("Invalid token");
    const placeDoc = await Place.findById(id);
    if (user.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, addedPhotos, description, perks, extraInfo,
        checkIn, checkOut, maxGuests, price
      });
      await placeDoc.save();
      res.json("ok");
    } else {
      res.status(403).json("Not authorized");
    }
  });
});

// Get all places
app.get("/places", async (req, res) => {
  const { checkInDate, checkOutDate } = req.query;
  const selectedCheckIn = new Date(checkInDate);
  const selectedCheckOut = new Date(checkOutDate);
  let filteredPlaces = await Place.find();

  if (checkInDate && checkOutDate) {
    filteredPlaces = filteredPlaces.filter((place) => {
      const placeCheckInDate = new Date(place.checkIn.Date);
      const placeCheckOutDate = new Date(place.checkOut.Date);
      return (
        selectedCheckIn <= placeCheckOutDate &&
        selectedCheckOut >= placeCheckInDate &&
        selectedCheckIn >= placeCheckInDate &&
        selectedCheckOut <= placeCheckOutDate
      );
    });
  }
  res.json(filteredPlaces);
});

// Create booking
app.post("/booking", async (req, res) => {
  const { blue } = req.cookies;
  if (!blue) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in to make a booking",
    });
  }
  const { place, checkInDate, checkOutDate, name, mobile, price } = req.body;
  if (!place || !checkInDate || !checkOutDate || !name || !mobile || !price) {
    return res.status(400).json({
      error: "Missing required fields",
      message: "Please provide all required fields"
    });
  }
  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const bookingDoc = await Booking.create({
      place, user: user.id, checkInDate, checkOutDate, name, mobile, price,
    });
    res.json(bookingDoc);
  });
});

// Get bookings
app.get("/bookings", async (req, res) => {
  const { blue } = req.cookies;
  if (!blue) return res.status(401).json({ error: "Not authenticated" });
  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const bookings = await Booking.find({ user: user.id })
      .populate({ path: "place", populate: { path: "owner" } });
    res.json(bookings);
  });
});

// Delete booking
app.delete("/user-bookings/:id", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(200).json("Booking deleted successfully");
});

// ====== START SERVER ======
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
