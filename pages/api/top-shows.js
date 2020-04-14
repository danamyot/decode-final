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

  // Different data structure is returned from Trakt based on the category,
  // so we need to normalize the data
  const normalizedShows = shows.map(show => {
    if (show.show) {
      return show.show;
    }
    return show;
  });

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------

  const relatedShowImages = await Promise.all(
    normalizedShows.map(async show => {
      return await tvdbService.getShowImage(show.ids.tvdb, "poster");
    })
  );

  const showsWithImage = normalizedShows.map((showInfo, i) => {
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
