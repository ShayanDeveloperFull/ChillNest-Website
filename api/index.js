const express = require('express')
const cors = require('cors')
require('dotenv').config();
const User = require("./models/User.js")
const Place = require("./models/place.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const imageDownloader = require("image-downloader")
const validUrl = require("valid-url");

const multer = require("multer")
const fs = require("fs")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/uploads", express.static(__dirname + "/uploads"))

app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));

app.use(cookieParser());

const bcryptPassword = bcrypt.genSaltSync(10)
const jwtAccess = process.env.JWT_SECRET

const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL)


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!email) {
    return res.status(400).json("Email Address Needs A Valid Input")
  }

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptPassword)
    })
    res.json(userDoc)
  } catch (err) {
    res.status(409).json(err)
  }

})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const userDoc = await User.findOne({ email })
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtAccess, {}, (err, token) => {
        if (err) throw err
        res.cookie("blue", token).json(userDoc)
        //console.log(userDoc)
      })
    } else {
      res.status(404).json("Password Does Not Match")
    }
  } else {
    res.status(401).json("This Email Address Has Not Been Registered")
  }
})

app.get("/profile", (req, res) => {
  const { blue } = req.cookies

  if (blue) {
    jwt.verify(blue, jwtAccess, {}, async (err, user) => {
      if (err) throw err;
      //console.log(user)
      const { name, email, _id } = await User.findById(user.id)
      res.json({ name, email, _id })
    })

  } else {
    res.json(null)
  }
})

app.post("/logout", (req, res) => {
  res.cookie("blue", "").json(true)
})

app.post("/upload-by-link", async (req, res) => {
  const { photoLink } = req.body
  //console.log(photoLink)

  // Validate if `photoLink` is present.
  if (!photoLink) {
    return res.status(400).json("Image Address Is Required");
  }

  // Validate if `photoLink` is a valid URL
  if (!validUrl.isUri(photoLink)) {
    return res.status(400).json("Invalid URL provided");
  }

  const newName = "photo" + Date.now() + ".jpg"
  await imageDownloader.image({
    url: photoLink,
    dest: __dirname + "/uploads/" + newName
  })
  res.json(newName)
})


const photosMiddleWare = multer({ dest: "uploads" })

app.post("/upload", photosMiddleWare.array("photos", 100), (req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".")
    const ext = parts[parts.length - 1]
    const newPath = path + "." + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace("uploads\\", ""))
  }
  //res.json(req.files)
  res.json(uploadedFiles)
})

app.post("/places", (req, res) => {
  const { blue } = req.cookies
  const { title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price } = req.body

  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: user.id,
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
    })
    res.json({ placeDoc })
  })
})

app.get("/user-places", (req, res) => {
  const { blue } = req.cookies
  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    //console.log(user)
    const { id } = user
    res.json(await Place.find({ owner: id }))
  })
})

app.get("/places/:id", async (req, res) => {
  const { id } = req.params
  res.json(await Place.findById(id))
})

app.put("/updatePlaces", async (req, res) => {
  const { blue } = req.cookies
  const { id, title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests, price } = req.body

  jwt.verify(blue, jwtAccess, {}, async (err, user) => {
    if (err) throw err
    const placeDoc = await Place.findById(id)
    if (user.id === placeDoc.owner.toString()) {
      placeDoc.set({
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
      })
      placeDoc.save()
      res.json("ok")
    }
  })
})

app.get("/places", async (req, res) => {
  res.json(await Place.find())
})

app.listen(4000)