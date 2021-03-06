import { useSelector } from "react-redux";

import BannerSearch from "components/BannerSearch";
import Layout from "components/Layout";
import ShowList from "components/ShowList";

const SearchResults = () => {
  const { searchResults: results, searchQuery } = useSelector(
    (state) => state.search
  );

  const sortResults = (results) => results.sort((a, b) => b.votes - a.votes);

  return (
    <Layout pageName="search-results">
      <div>
        <BannerSearch currentQuery={searchQuery} />
        <div id="main">
          <section id="one" className="search-results tiles">
            <div className="inner">
              {results && (
                <ShowList
                  data={sortResults(results)}
                  listTitle="Search Results"
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
