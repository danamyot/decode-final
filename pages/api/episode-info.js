import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  const {
    id: showId,
    season: seasonNumber,
    episode: episodeNumber
  } = req.query;

  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [showInfo, episodesInfo] = await Promise.all([
    await traktService.getShowInfo(showId),
    await traktService.getShowSeason(showId, seasonNumber, "full")
  ]);

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------
  const [seasonEpisodes] = await Promise.all([
    await tvdbService.getShowEpisodes(showInfo.ids.tvdb, seasonNumber)
  ]);

  const SortedEpisodes = seasonEpisodes.data.sort(
    (a, b) => a.airedEpisodeNumber - b.airedEpisodeNumber
  );

  const combinedEpisodesInfo = SortedEpisodes.map((episode, i) => ({
    ...episodesInfo[i],
    ...episode
  }));

  const fullEpisodeInfo = {
    ...combinedEpisodesInfo[episodeNumber - 1],
    nextEpisode: { ...combinedEpisodesInfo[episodeNumber] },
    previousEpisode: { ...combinedEpisodesInfo[episodeNumber - 2] },
    showInfo: { ...showInfo }
  };

  res.status(200).json(fullEpisodeInfo);
};
