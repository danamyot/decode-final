import Link from "next/link";

const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

const ShowCard = ({ show }) => (
  <Link href="/shows/[showSlug]" as={`/shows/${show.ids.slug}`}>
    <a>
      <div className="b-game-card">
        <div
          className="b-game-card__cover"
          style={{
            backgroundImage: `url('${BASE_TVDB_IMG_URL}/${show.imageData.fileName}')`
          }}
        ></div>
      </div>
    </a>
  </Link>
);

export default ShowCard;
