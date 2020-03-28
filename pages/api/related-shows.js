import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [relatedShows] = await Promise.all([
    await traktService.getRelatedShows(req.query.id, req.query.limit)
  ]);

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------
  const relatedShowImages = await Promise.all(
    relatedShows.map(
      async show => await tvdbService.getShowImage(show.ids.tvdb, "poster")
    )
  );

  const relatedShowsWithImages = relatedShows.map((show, i) => {
    show.imageData = relatedShowImages[i][0];
    return show;
  });

  res.status(200).json(relatedShowsWithImages);
};
