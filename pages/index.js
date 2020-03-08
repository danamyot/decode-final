import Link from "next/link";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";

import Layout from "../components/Layout";
import BannerSearch from "../components/BannerSearch";
import ShowCard from "../components/ShowCard";

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
          <section id="two">
            <div className="inner">
              <header className="major">
                <h2>Massa libero</h2>
              </header>
              <p>
                Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
                libero. Mauris aliquet magna magna sed nunc rhoncus pharetra.
                Pellentesque condimentum sem. In efficitur ligula tate urna.
                Maecenas laoreet massa vel lacinia pellentesque lorem ipsum
                dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et
                sagittis libero. Mauris aliquet magna magna sed nunc rhoncus
                amet pharetra et feugiat tempus.
              </p>
              <ul className="actions">
                <li>
                  <Link href="/landing">
                    <a className="button next">Get Started</a>
                  </Link>
                </li>
              </ul>
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
