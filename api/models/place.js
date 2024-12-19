const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  addedPhotos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: {
    Date: String,
    Time: String
  },
  checkOut: {
    Date: String,
    Time: String
  },
  maxGuests: Number,
  price: Number
})

const PlaceModel = mongoose.model("Place", placeSchema)

module.exports = PlaceModel