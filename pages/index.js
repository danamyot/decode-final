import { useSelector } from "react-redux";
import useSWR from "swr";

import BannerSearch from "components/BannerSearch";
import Layout from "components/Layout";
import ShowList from "components/ShowList";
import fetcher from "services/fetcher";

import { BASE_API_URL } from "config/dev.config.json";

const Index = () => {
  const { data: trendingShows } = useSWR(
    `${BASE_API_URL}/api/top-shows?category=trending&limit=8`,
    fetcher
  );

  const { data: popularShows } = useSWR(
    `${BASE_API_URL}/api/top-shows?category=popular&limit=8`,
    fetcher
  );

  const { data: mostWatchedShows } = useSWR(
    `${BASE_API_URL}/api/top-shows?category=watched&limit=8`,
    fetcher
  );

  const { searchResults, searchQuery } = useSelector((state) => state.search);

  const sortResults = (results) => results.sort((a, b) => b.votes - a.votes);

  return (
    <Layout pageName="index">
      <div>
        <BannerSearch currentQuery={searchQuery} />
        <div id="main">
          {searchResults ? (
            <section id="one" className="search-results tiles">
              <div className="inner">
                {searchResults && (
                  <ShowList
                    data={sortResults(searchResults)}
                    listTitle="Search Results"
                  />
                )}
              </div>
            </section>
          ) : (
            <>
              <section id="one" className="trending-shows tiles">
                <div className="inner">
                  <ShowList
                    data={trendingShows}
                    listTitle="Trending Shows"
                    link="/list/trending"
                  />
                </div>
              </section>
              <section id="two" className="popular-shows tiles">
                <div className="inner">
                  <ShowList
                    data={popularShows}
                    listTitle="Popular Shows"
                    link="/list/popular"
                  />
                </div>
              </section>
              <section id="three" className="most-watched-shows tiles">
                <div className="inner">
                  <ShowList
                    data={mostWatchedShows}
                    listTitle="Most Watched Shows"
                    link="/list/watched"
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
