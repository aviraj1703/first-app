import mongoose from "mongoose";

const favoritePlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  vicinity: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: undefined,
  },
  user_ratings_total: {
    type: Number,
    default: undefined,
  },
  image: {
    type: String,
    default: undefined
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteList: [{
    type: favoritePlaceSchema,
  }],
});

mongoose.model("User", userSchema);
