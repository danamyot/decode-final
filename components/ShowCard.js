import Link from "next/link";

import { BASE_TVDB_IMG_URL } from "config/dev.config.json";

const ShowCard = ({ show }) => (
  <Link href="/shows/[showId]" as={`/shows/${show.ids.slug}`}>
    <a>
      <div className="show-card">
        <div
          className="show-card__cover"
          style={{
            backgroundImage: `url('${BASE_TVDB_IMG_URL}/${show.imageData.fileName}')`
          }}
        ></div>
      </div>
    </a>
  </Link>
);

export default ShowCard;
