import Link from "next/link";

import MissingImage from "components/MissingImage";

import { BASE_TVDB_IMG_URL } from "config/dev.config.json";

const ShowCard = ({ show }) => (
  <Link href="/shows/[showId]" as={`/shows/${show.ids.slug}`}>
    <a>
      <div className="show-card">
        {show.imageData ? (
          <div
            className="show-card__cover"
            style={{
              backgroundImage: `url('${BASE_TVDB_IMG_URL}/${show.imageData.fileName}')`
            }}
          ></div>
        ) : (
          <MissingImage componentClass="show-card__cover" />
        )}
      </div>
      <h4>{show.title}</h4>
    </a>
  </Link>
);

export default ShowCard;
