import axios from "axios";

import { TRAKT_CLIENT_ID } from "config/dev.config.json";

const instance = axios.create({
  baseURL: "https://api.trakt.tv",
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": TRAKT_CLIENT_ID
  }
});

const getRelatedShows = (showId, limit) => {
  return instance.get(`/shows/${showId}/related?limit=${limit}`).then(
    response => response.data,
    error => error
  );
};

const getShowAllSeasons = showId => {
  return instance.get(`/shows/${showId}/seasons?extended=full`).then(
    response => response.data,
    error => error
  );
};

const getShowInfo = (showId, extended) => {
  return instance
    .get(`/shows/${showId}${extended ? `?extended=${extended}` : ""}`)
    .then(
      response => response.data,
      error => error
    );
};

const getShowSeason = (showId, seasonNumber, extended) => {
  return instance
    .get(
      `/shows/${showId}/seasons/${seasonNumber}${
        extended ? `?extended=${extended}` : ""
      }`
    )
    .then(
      response => response.data,
      error => error
    );
};

const getTopShows = (category, limit) => {
  return instance.get(`/shows/${category}?limit=${limit}`).then(
    response => response.data,
    error => error
  );
};

export default {
  getRelatedShows,
  getShowAllSeasons,
  getShowSeason,
  getShowInfo,
  getTopShows
};
