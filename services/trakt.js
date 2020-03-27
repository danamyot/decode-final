import axios from "axios";

import { TRAKT_CLIENT_ID } from "config/dev.config.json";

const instance = axios.create({
  baseURL: "https://api.trakt.tv",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": TRAKT_CLIENT_ID
  }
});

const getShowSeasons = showId => {
  return instance
    .get(`/shows/${showId}/seasons?extended=full`)
    .then(response => response.data);
};

const getShowInfo = showId => {
  return instance
    .get(`/shows/${showId}?extended=full`)
    .then(response => response.data);
};

export default {
  getShowSeasons,
  getShowInfo
};
