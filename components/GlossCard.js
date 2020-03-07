const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

const GlossCard = ({ show }) => (
  <div className="b-game-card">
    <div
      className="b-game-card__cover"
      style={{
        backgroundImage: `url('${BASE_TVDB_IMG_URL}/${show.imageData.fileName}')`
      }}
    ></div>
  </div>
);

export default GlossCard;
