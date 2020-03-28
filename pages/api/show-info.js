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

  const showWithImage = {
    ...showInfo,
    cast: [...castInfo],
    seasons: [...seasonsInfo],
    imageData
  };

  res.status(200).json(showWithImage);
};
