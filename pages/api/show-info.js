import fetch from "isomorphic-unfetch";

const BASE_TRAKT_URL = "https://api.trakt.tv";
const TRAKT_CLIENT_ID =
  "72708317a1318fd9267b67ad106f259bcf41fdf9ef449d06b8a00ca369f54393";
const BASE_TVDB_URL = "https://api.thetvdb.com";
const TVDB_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODU1MTY4MjQsImlkIjoiRGFuIEFteW90Iiwib3JpZ19pYXQiOjE1ODQ5MTIwMjQsInVzZXJpZCI6MjI2MjU5MywidXNlcm5hbWUiOiJkYW5hbXlvdCJ9.2T__0Yej3_AEfEUhPpFviKNXLNQ4QU7osZHlgncCXrb1cMWfiTBId__Sn_imHQiJ46x4XcrcikHL9Lu53A0vcuUxX_ASbL_Ub_UxO4Ly5qVfRMoFJ3e0trXnFke1dJsh6ecZ1x1Ne1Q8U9ZJWDqS3btLusIDQxEgmIgPa0vh3kdhmLzw953JGDNxthlwC47XXpanADvIZNR-dmWBzN3kasV-iX77FuYlENc0fGwyCqjyYKaDNuXfROs4k6e74q5CV2I29kXaryVyNIc2cjGfMWZnGM0dn9Y7E2CSijYm4NvqHfoSjGCSptEp09dvY88raFNZhKzqtrtGBrs5XH42Qw";

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
