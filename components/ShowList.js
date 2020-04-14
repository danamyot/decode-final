import ShowCard from "components/ShowCard";
import Link from "next/link";

const ShowList = ({ data, listTitle, link }) => (
  <div className="show-list">
    <header className="major">
      <h2>{listTitle}</h2>
    </header>
    <div className="show-card-container">
      {data
        ? data.map(show => <ShowCard key={show.ids.trakt} show={show} />)
        : "loading..."}
    </div>
    {link && (
      <Link href="/list/[listCategory]" as={link}>
        <a className="button special small">View More</a>
      </Link>
    )}
  </div>
);
export default ShowList;
