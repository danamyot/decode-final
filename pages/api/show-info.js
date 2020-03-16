import fetch from "isomorphic-unfetch";

const BASE_TRAKT_URL = "https://api.trakt.tv";
const TRAKT_CLIENT_ID =
  "72708317a1318fd9267b67ad106f259bcf41fdf9ef449d06b8a00ca369f54393";
const BASE_TVDB_URL = "https://api.thetvdb.com";
const TVDB_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQ0OTIyMzgsImlkIjoiRGFuIEFteW90Iiwib3JpZ19pYXQiOjE1ODM4ODc0MzgsInVzZXJpZCI6MjI2MjU5MywidXNlcm5hbWUiOiJkYW5hbXlvdCJ9.fMxWqmmp3sEhihVuRzo_fFYZtwG7T30AOztP02c7mVAq43RvstRd3tlhqZW1Uc7WLIOSkDHgrc0hnm-LBjMAgOGlQO3d00bnARK-WffpVAOcmUtrI6YQjUsXruwRzULIsroS1KPoVtx4AcEDjTuCv9xyt_Zxjqa6xtKwd8GXM10xK2vK7dxgg0JIgGLqwI2-gTQC7i8HK5i-lf_wLQcmASj3dgetqvnD6tTcs1nusYP3EhGu6nZW1uK2eXPnXZT4vGvzrLjjths9QfM0R1nGW5QWwZ93nnIqzzwI2srww7F6QdeAaEAn4mfVte8SQprNWFUkGPhGKcgEArn3OqBhmg";

export default async (req, res) => {
  const traktHeader = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": TRAKT_CLIENT_ID
  };

  const fullShowInfo = await (
    await fetch(`${BASE_TRAKT_URL}/shows/${req.query.id}?extended=full`, {
      headers: traktHeader
    })
  ).json();

  const fullSeasonInfo = await (
    await fetch(
      `${BASE_TRAKT_URL}/shows/${req.query.id}/seasons?extended=full`,
      {
        headers: traktHeader
      }
    )
  ).json();

  const tvdbHeaders = { Authorization: "Bearer " + TVDB_TOKEN };
  const [showPosters, showFanart, showSeries, showSeason] = await Promise.all([
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=poster`,
      { headers: tvdbHeaders }
    ),
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=fanart`,
      { headers: tvdbHeaders }
    ),
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=series`,
      { headers: tvdbHeaders }
    ),
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=season`,
      { headers: tvdbHeaders }
    )
  ]);

  const imageData = {
    posters: (await showPosters.json()).data,
    fanart: (await showFanart.json()).data,
    series: (await showSeries.json()).data,
    season: (await showSeason.json()).data
  };

  const showWithImage = {
    ...fullShowInfo,
    seasons: [...fullSeasonInfo],
    imageData
  };

  res.status(200).json(showWithImage);
};
