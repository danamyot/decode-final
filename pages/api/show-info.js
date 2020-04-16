import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [showInfo, seasonsInfo] = await Promise.all([
    await traktService.getShowInfo(req.query.id, "full"),
    await traktService.getShowAllSeasons(req.query.id)
  ]);

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------
  const traktShowId = showInfo.ids.tvdb;

  const [castInfo, posters, fanart, seriesArt, seasonArt] = await Promise.all([
    await tvdbService.getShowCast(traktShowId),
    await tvdbService.getShowImage(traktShowId, "poster"),
    await tvdbService.getShowImage(traktShowId, "fanart"),
    await tvdbService.getShowImage(traktShowId, "series"),
    await tvdbService.getShowImage(traktShowId, "season")
  ]);

  const imageData = {
    posters,
    fanart,
    series: seriesArt,
    season: seasonArt
  };

  let showWithImage = {
    ...showInfo,
    seasons: [...seasonsInfo],
    imageData
  };

  if (castInfo.response && castInfo.response.status === 404) {
    return res.status(200).json(showWithImage);
  }

  const showWithCast = {
    ...showInfo,
    cast: [...castInfo],
    seasons: [...seasonsInfo],
    imageData
  };

  res.status(200).json(showWithCast);
};
