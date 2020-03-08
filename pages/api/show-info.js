import fetch from "isomorphic-unfetch";

const BASE_TRAKT_URL = "https://api.trakt.tv";
const TRAKT_CLIENT_ID =
  "72708317a1318fd9267b67ad106f259bcf41fdf9ef449d06b8a00ca369f54393";
const BASE_TVDB_URL = "https://api.thetvdb.com";
const TVDB_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODQwNTc1NDcsImlkIjoiRGFuIEFteW90Iiwib3JpZ19pYXQiOjE1ODM0NTI3NDcsInVzZXJpZCI6MjI2MjU5MywidXNlcm5hbWUiOiJkYW5hbXlvdCJ9.GAybuWqSaNSBpm2gYNWVwdp9NKorEsyEmhTg6ypieYs1sY4eR-k6m8L1-wgFxqIuDDn_zx92lSnjvsF06RKJHGwtuo-dcymTIRE6jV6V5ZAJJRISFjR41pf6Iy3oQqG1TVnossjPnz30LqV0SdbF63TC4vja_xGBvSwlmMXMWr1xuwdYYIuyaEGa1irY6jILOQnbuBGOIRfz71TZ612ybC7BOUbgPUjYh6dCJ3lwRaX00666Ny9_GV1M02Rfb9lzOblOeTg1i62lIZhLJzjlUITbl1foeK6OKQl_n9VMaSdI0jr85xO-sMXCBkt1p2DqGOI0dybO_cpjWlibqKU7qQ";

export default async (req, res) => {
  const fullShowInfo = await (
    await fetch(`${BASE_TRAKT_URL}/shows/${req.query.id}?extended=full`, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID
      }
    })
  ).json();

  fullShowInfo.ids.tvdb;

  const [showPosters, showFanart, showSeries] = await Promise.all([
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=poster`,
      { headers: { Authorization: "Bearer " + TVDB_TOKEN } }
    ),
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=fanart`,
      { headers: { Authorization: "Bearer " + TVDB_TOKEN } }
    ),
    fetch(
      `${BASE_TVDB_URL}/series/${fullShowInfo.ids.tvdb}/images/query?keyType=series`,
      { headers: { Authorization: "Bearer " + TVDB_TOKEN } }
    )
  ]);

  const imageData = {
    posters: await showPosters.json(),
    fanart: await showFanart.json(),
    series: await showSeries.json()
  };

  const showWithImage = {
    ...fullShowInfo,
    imageData
  };

  res.status(200).json(showWithImage);
};
