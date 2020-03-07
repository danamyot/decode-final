import Link from "next/link";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";

import Layout from "../components/Layout";
import Banner from "../components/Banner";

const API_URL = "http://localhost:3000/api/popular-shows";
const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const Index = ({ initialData }) => {
  const { data } = useSWR(API_URL, fetcher, { initialData });

  return (
    <Layout>
      <div>
        <Banner />

        <div id="main">
          <section id="one" className="tiles">
            {data
              ? data.map(show => (
                  <article
                    style={{
                      backgroundImage: `url('${BASE_TVDB_IMG_URL}/${show.imageData.fileName}')`
                    }}
                  >
                    <header className="major">
                      <h3>{show.title}</h3>
                      <p>{show.year}</p>
                    </header>
                    <Link href="/landing">
                      <a className="link primary"></a>
                    </Link>
                  </article>
                ))
              : "loading..."}
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
