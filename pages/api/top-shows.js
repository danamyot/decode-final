import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [shows] = await Promise.all([
    await traktService.getTopShows(req.query.category, req.query.limit)
  ]);

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------

  const relatedShowImages = await Promise.all(
    shows.map(
      async show => await tvdbService.getShowImage(show.ids.tvdb, "poster")
    )
  );

  const showsWithImage = shows.map((showInfo, i) => {
    let newShow = {
      ...showInfo
    };

    const randShowImage = Math.floor(
      Math.random() * relatedShowImages[i].length
    );

    newShow.imageData = relatedShowImages[i][randShowImage];

    return newShow;
  });

  res.status(200).json(showsWithImage);
};
