import axios from "axios";
import jwt_decode from "jwt-decode";

import { TVDB_AUTH } from "config/dev.config.json";

let tvdbToken, tvdbTokenExp;

const instance = axios.create({
  baseURL: "https://api.thetvdb.com",
  timeout: 2000,
  headers: {
    "Accept-Language": "en"
  }
});

instance.interceptors.request.use(
  config => {
    let originalRequest = config;
    if (config.url === "/login") return config;
    if (!tvdbToken || !tvdbTokenExp || tvdbTokenExp < Date.now()) {
      return getToken().then(token => {
        tvdbToken = token;
        tvdbTokenExp = jwt_decode(token).exp * 1000;
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return Promise.resolve(originalRequest);
      });
    } else {
      originalRequest.headers["Authorization"] = "Bearer " + tvdbToken;
    }

    return originalRequest;
  },
  err => {
    return Promise.reject(err);
  }
);

const getShowCast = showId => {
  return instance.get(`/series/${showId}/actors`).then(
    response => response.data.data,
    error => console.log(error)
  );
};

const getShowEpisodes = (showId, seasonNumber) => {
  return instance
    .get(`/series/${showId}/episodes/query?airedSeason=${seasonNumber}`)
    .then(
      response => response.data,
      error => console.log(error)
    );
};

const getShowImage = (showId, imageType) => {
  return instance
    .get(`/series/${showId}/images/query?keyType=${imageType}`)
    .then(
      response => response.data.data,
      error => console.log(error)
    );
};

const getToken = () => {
  return instance.post(`/login`, TVDB_AUTH).then(
    response => response.data.token,
    error => console.log(error)
  );
};

export default {
  getShowCast,
  getShowEpisodes,
  getShowImage
};
