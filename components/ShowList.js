import ShowCard from "components/ShowCard";
import Link from "next/link";
import Loader from "./Loader";

const ShowList = ({ data, listTitle, link }) => (
  <div className="show-list">
    <header className="major">
      <h2>{listTitle}</h2>
    </header>
    {data ? (
      <>
        <div className="show-card-container">
          {data.map((show) => (
            <ShowCard key={show.ids.trakt} show={show} />
          ))}
        </div>
        {link && data && (
          <Link href="/list/[listCategory]" as={link}>
            <a className="button special small">View More</a>
          </Link>
        )}
      </>
    ) : (
      <Loader />
    )}
  </div>
);
export default ShowList;
