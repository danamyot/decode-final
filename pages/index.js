import useSWR from "swr";

import Layout from "components/Layout";
import BannerSearch from "components/BannerSearch";
import ShowCard from "components/ShowCard";
import fetcher from "services/fetcher";

import { BASE_API_URL } from "config/dev.config.json";

const Index = ({ initialData }) => {
  const {
    data
  } = useSWR(
    `${BASE_API_URL}/api/top-shows?category=popular&limit=12`,
    fetcher,
    { initialData }
  );

  return (
    <Layout pageName="index">
      <div>
        <BannerSearch />

        <div id="main">
          <section id="one" className="tiles">
            <div className="inner">
              <header className="major">
                <h2>Popular Shows</h2>
              </header>
              <div className="show-card-container">
                {data
                  ? data.map(show => (
                      <ShowCard key={show.ids.trakt} show={show} />
                    ))
                  : "loading..."}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

Index.getInitialProps = async function() {
  const data = await fetcher(
    `${BASE_API_URL}/api/top-shows?category=popular&limit=12`
  );

  return { initialData: data };
};

export default Index;
