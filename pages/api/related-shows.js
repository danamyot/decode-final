import fetch from "isomorphic-unfetch";

const BASE_TRAKT_URL = "https://api.trakt.tv";
const TRAKT_CLIENT_ID =
  "72708317a1318fd9267b67ad106f259bcf41fdf9ef449d06b8a00ca369f54393";
const BASE_TVDB_URL = "https://api.thetvdb.com";
const TVDB_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODU1MTY4MjQsImlkIjoiRGFuIEFteW90Iiwib3JpZ19pYXQiOjE1ODQ5MTIwMjQsInVzZXJpZCI6MjI2MjU5MywidXNlcm5hbWUiOiJkYW5hbXlvdCJ9.2T__0Yej3_AEfEUhPpFviKNXLNQ4QU7osZHlgncCXrb1cMWfiTBId__Sn_imHQiJ46x4XcrcikHL9Lu53A0vcuUxX_ASbL_Ub_UxO4Ly5qVfRMoFJ3e0trXnFke1dJsh6ecZ1x1Ne1Q8U9ZJWDqS3btLusIDQxEgmIgPa0vh3kdhmLzw953JGDNxthlwC47XXpanADvIZNR-dmWBzN3kasV-iX77FuYlENc0fGwyCqjyYKaDNuXfROs4k6e74q5CV2I29kXaryVyNIc2cjGfMWZnGM0dn9Y7E2CSijYm4NvqHfoSjGCSptEp09dvY88raFNZhKzqtrtGBrs5XH42Qw";

export default async (req, res) => {
  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------

  const traktHeader = {
    "Content-Type": "application/json",
    "trakt-api-version": "2",
    "trakt-api-key": TRAKT_CLIENT_ID
  };
  const relatedShows = await (
    await fetch(
      `${BASE_TRAKT_URL}/shows/${req.query.id}/related?limit=${req.query.limit}`,
      {
        headers: traktHeader
      }
    )
  ).json();

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------

  const tvdbHeaders = {
    Authorization: "Bearer " + TVDB_TOKEN,
    "Accept-Language": "en"
  };
  const relatedShowImages = await Promise.all(
    relatedShows.map(async show =>
      (
        await fetch(
          `${BASE_TVDB_URL}/series/${show.ids.tvdb}/images/query?keyType=poster`,
          {
            headers: tvdbHeaders
          }
        )
      ).json()
    )
  );

  const relatedShowsWithImages = relatedShows.map((show, i) => {
    show.imageData = relatedShowImages[i].data[0];
    return show;
  });

  res.status(200).json(relatedShowsWithImages);
};
