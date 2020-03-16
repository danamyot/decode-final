import Link from "next/link";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";

import Layout from "components/Layout";
import BannerSearch from "components/BannerSearch";
import ShowCard from "components/ShowCard";

const API_URL = "http://localhost:3000/api/popular-shows?limit=12";

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const Index = ({ initialData }) => {
  const { data } = useSWR(API_URL, fetcher, { initialData });

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
              <div className="card-container">
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
  const data = await fetcher(API_URL);

  return { initialData: data };
};

export default Index;
