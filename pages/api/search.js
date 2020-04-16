import traktService from "services/trakt";
import tvdbService from "services/tvdb";

export default async (req, res) => {
  const { query } = req.query;

  // ----------------------------
  //
  // TRAKT API
  //
  // ----------------------------
  const [searchResult] = await Promise.all([
    await traktService.getSearchResults(query)
  ]);

  // ----------------------------
  //
  // TVDB API
  //
  // ----------------------------
  const resultShowImages = await Promise.all(
    searchResult.map(async show => {
      return await tvdbService.getShowImage(show.show.ids.tvdb, "poster");
    })
  );

  const resultsWithImage = searchResult.map((showInfo, i) => {
    let result = {
      ...showInfo.show
    };

    const randShowImage = Math.floor(
      Math.random() * resultShowImages[i].length
    );

    result.imageData = resultShowImages[i][randShowImage];

    return result;
  });

  res.status(200).json(resultsWithImage);
};
