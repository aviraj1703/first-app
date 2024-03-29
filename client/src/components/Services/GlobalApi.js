import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "@env";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";
const API_KEY = GOOGLE_MAPS_API_KEY;

const nearByPlcaes = (latitude, longitude, value) =>
  axios.get(
    BASE_URL +
      "/nearbysearch/json?" +
      "&location=" +
      latitude +
      "," +
      longitude +
      "&radius=1500&type=" +
      value +
      "&key=" +
      API_KEY
  );

const searchByText = (searchText) =>
  axios.get(
    BASE_URL + "/textsearch/json?query=" + searchText + "&key=" + API_KEY
  );

export default { nearByPlcaes, searchByText };
