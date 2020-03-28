import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  const { id: showId, seasonNumber } = req.query;

  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [showInfo, episodeInfo, allSeasonsInfo] = await Promise.all([
    await traktService.getShowInfo(showId, "full"),
    await traktService.getShowSeason(showId, seasonNumber, "full"),
    await traktService.getShowAllSeasons(showId, seasonNumber)
  ]);

  // Only send info for the requested season
  const seasonInfo = allSeasonsInfo.find(
    season => season.number === parseInt(seasonNumber)
  );

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------
  const traktShowId = showInfo.ids.tvdb;

  const [seasonEpisodes] = await Promise.all([
    await tvdbService.getShowEpisodes(traktShowId, seasonNumber)
  ]);

  const SortedEpisodes = seasonEpisodes.data.sort(
    (a, b) => a.airedEpisodeNumber - b.airedEpisodeNumber
  );

  const seasonEpisodesArt = SortedEpisodes.map(episode => episode.filename);

  const fullSeasonInfo = {
    ...seasonInfo,
    episodes: [...episodeInfo],
    imageData: {
      episodes: [...seasonEpisodesArt]
    },
    showInfo: { ...showInfo }
  };

  res.status(200).json(fullSeasonInfo);
};
