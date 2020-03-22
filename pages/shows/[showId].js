import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import moment from "moment";

import Layout from "components/Layout";
import Banner from "components/Banner";

const API_URL = "http://localhost:3000/api/show-info";
const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const ShowPage = ({ initialData }) => {
  const router = useRouter();
  const { data } = useSWR(`${API_URL}?id=${router.query.showId}`, fetcher, {
    initialData
  });
  const bannerSubHeader = `Aired: ${data.year} | ${data.network} | Status: ${
    data.status !== "returning series" && data.status !== "in production"
      ? data.status
      : ""
  }`;

  process.browser ? console.log(data) : "";

  return (
    <Layout pageName="show-id">
      <Head>
        <title>{data.title} | Trakr.tv</title>
        <meta name="description" content={`${data.title} show information.`} />
      </Head>

      <div>
        <Banner
          heading={data.title}
          subHeading={bannerSubHeader}
          background={`${BASE_TVDB_IMG_URL}/${data.imageData.fanart[0].fileName}`}
        />

        <div id="main">
          <section id="one">
            <div className="inner">
              <header className="major">
                <h2>Overview</h2>
              </header>
              <p>{`Genres: ${data.genres.join(", ")}`}</p>
              <p>{data.overview}</p>
              <p>
                <a href={data.homepage}>Homepage</a>
              </p>
              <h4>Trailer</h4>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${
                  data.trailer.split("?v=")[1]
                }`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </section>
          <section id="two" className="spotlights">
            {data.seasons.map(season =>
              season.number > 0 ? (
                <section key={season.number}>
                  <Link href={`${router.query.showId}/season/${season.number}`}>
                    <a className="image">
                      <img
                        src={`${BASE_TVDB_IMG_URL}/${
                          data.imageData.season.find(
                            seasonImage =>
                              seasonImage.subKey === `${season.number}`
                          ).fileName
                        }`}
                        alt={`Season ${season.number}`}
                      />
                    </a>
                  </Link>
                  <div className="content">
                    <div className="inner">
                      <header className="major">
                        <h3>
                          Season {season.number} (
                          {moment(season.first_aired).year()})
                        </h3>
                      </header>
                      <p>Episodes: {season.aired_episodes}</p>
                      <ul className="actions">
                        <li>
                          <Link
                            href={`${router.query.showId}/season/${season.number}`}
                          >
                            <a className="button">Learn more</a>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>
              ) : (
                undefined
              )
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const data = await fetcher(`${API_URL}?id=${query.showId}`);

  return { initialData: data };
};

export default ShowPage;
