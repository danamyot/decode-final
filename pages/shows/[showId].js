import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import moment from "moment";
import Slider from "react-slick";

import Layout from "components/Layout";
import Banner from "components/Banner";
import ShowCard from "components/ShowCard";
import { arrayCapitalize } from "utils/helpers";

const BASE_API_URL = "http://localhost:3000";
const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

async function fetcher(...args) {
  const res = await fetch(...args);
  return res.json();
}

const ShowPage = ({ initialShowData, initialRelatedShowsData }) => {
  const router = useRouter();
  const { data: showData } = useSWR(
    `${BASE_API_URL}/api/show-info?id=${router.query.showId}`,
    fetcher,
    {
      initialData: initialShowData
    }
  );
  process.browser && console.log(showData);
  const { data: relatedShowsData } = useSWR(
    `${BASE_API_URL}/api/related-shows?id=${router.query.showId}&limit=8`,
    fetcher,
    {
      initialData: initialRelatedShowsData
    }
  );
  const bannerSubHeader = `Aired: ${showData.year} | ${showData.network} ${
    showData.status !== "returning series" &&
    showData.status !== "in production"
      ? `| Status: ${showData.status}`
      : ""
  }`;
  const castSliderSettings = {
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 3
  };
  const relatedSliderSettings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  return (
    <Layout pageName="show-id">
      <Head>
        <title>{showData.title} | Trakr.tv</title>
        <meta
          name="description"
          content={`${showData.title} show information.`}
        />
      </Head>

      <div>
        <Banner
          heading={showData.title}
          subHeading={bannerSubHeader}
          background={`${BASE_TVDB_IMG_URL}/${showData.imageData.fanart[0].fileName}`}
        />

        <div id="main">
          <section id="one" className="show-info">
            <div className="inner">
              <div>
                <header className="major">
                  <h2>Overview</h2>
                </header>
                <p>{`Genres: ${arrayCapitalize(showData.genres).join(
                  ", "
                )}`}</p>
                <p>{showData.overview}</p>
                <p>
                  <a href={showData.homepage}>Homepage</a>
                </p>
              </div>
              <div className="show-trailer">
                {showData.trailer && (
                  <>
                    <h4>Trailer</h4>
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${
                        showData.trailer.split("?v=")[1]
                      }`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </>
                )}
              </div>
            </div>
          </section>
          <section id="two" className="cast">
            <div className="inner">
              <header className="major">
                <h2>Cast</h2>
              </header>
              <div className="cast-container">
                <Slider {...castSliderSettings}>
                  {showData.cast.slice(0, 10).map((castMember, i) => (
                    <div key={i} className="cast-member">
                      <div className="cast-member-img-container">
                        <div
                          style={{
                            backgroundImage: `URL(${BASE_TVDB_IMG_URL}/${castMember.image})`
                          }}
                          className="cast-member-img"
                        ></div>
                      </div>
                      <p className="cast-member-role" title={castMember.role}>
                        {castMember.role}
                      </p>
                      <p className="cast-member-actor" title={castMember.name}>
                        {castMember.name}
                      </p>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>
          <section id="three" className="spotlights">
            {showData.seasons.map(season =>
              season.number > 0 ? (
                <section key={season.number}>
                  <Link href={`${router.query.showId}/season/${season.number}`}>
                    <a className="image">
                      <img
                        src={`${BASE_TVDB_IMG_URL}/${
                          showData.imageData.season.find(
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
                      <div className="major">
                        <h3>
                          Season {season.number} (
                          {moment(season.first_aired).year()})
                        </h3>
                      </div>
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
          <section id="four" className="related-shows">
            <div className="inner">
              <header className="major">
                <h2>Related Shows</h2>
              </header>
              <Slider {...relatedSliderSettings}>
                {relatedShowsData.map(show => (
                  <div className="related-show-slide">
                    <ShowCard key={show.ids.trakt} show={show} />
                  </div>
                ))}
              </Slider>
              <div className="show-card-container"></div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const [showData, relatedShowsData] = await Promise.all([
    await fetcher(`${BASE_API_URL}/api/show-info?id=${query.showId}`),
    await fetcher(
      `${BASE_API_URL}/api/related-shows?id=${query.showId}&limit=8`
    )
  ]);

  return {
    initialShowData: showData,
    initialRelatedShowsData: relatedShowsData
  };
};

export default ShowPage;
