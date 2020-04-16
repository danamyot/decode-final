import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";

import Banner from "components/Banner";
import CastSlider from "components/CastSlider";
import Layout from "components/Layout";
import Loader from "components/Loader";
import MissingImage from "components/MissingImage";
import RelatedShows from "components/RelatedShows";
import YouTubePlayer from "components/YouTubePlayer";
import fetcher from "services/fetcher";
import { arrayCapitalize, generateDescription } from "utils/helpers";

import { BASE_TVDB_IMG_URL, BASE_API_URL } from "config/dev.config.json";

const ShowPage = () => {
  const router = useRouter();
  const { showId } = router.query;

  const { data: showData } = useSWR(
    `${BASE_API_URL}/api/show-info?id=${showId}`,
    fetcher
  );

  process.browser && console.log(showData);

  const { data: relatedShowsData } = useSWR(
    `${BASE_API_URL}/api/related-shows?id=${showId}&limit=8`,
    fetcher
  );

  const bannerSubHeader =
    showData &&
    `Aired: ${showData.year} | ${showData.network} | ${
      showData.certification
    } ${
      showData.status !== "returning series" &&
      showData.status !== "in production"
        ? `| Status: ${showData.status}`
        : ""
    }`;

  const findSeasonImage = (season, imageData) => {
    return (
      imageData &&
      imageData.find((seasonImage) => seasonImage.subKey === `${season.number}`)
        .fileName
    );
  };

  return (
    <Layout pageName="show-id">
      {showData ? (
        <>
          <Head>
            <title>{showData.title} | Trakr.tv</title>
            <meta
              name="description"
              content={`${showData.title}. ${showData.overview}`}
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
                  {showData.trailer && (
                    <div className="show-trailer">
                      <h4>Trailer</h4>
                      <YouTubePlayer
                        videoURL={`https://www.youtube.com/embed/${
                          showData.trailer.split("?v=")[1]
                        }`}
                      />
                    </div>
                  )}
                </div>
              </section>
              {showData.cast && (
                <section id="two" className="show-cast">
                  <div className="inner">
                    <CastSlider cast={showData.cast} />
                  </div>
                </section>
              )}
              <section id="three" className="seasons spotlights">
                {showData.seasons
                  .filter((season) => season.number > 0 && season.first_aired)
                  .map((season) => {
                    const seasonImage = findSeasonImage(
                      season,
                      showData.imageData.season
                    );

                    return (
                      <section key={season.number}>
                        <Link
                          href="/shows/[showId]/season/[seasonNumber]"
                          as={`/shows/${showId}/season/${season.number}`}
                        >
                          <a className="image">
                            {seasonImage ? (
                              <img
                                src={`${BASE_TVDB_IMG_URL}/${seasonImage}`}
                                alt={`${showData.title} ${season.title} image`}
                              />
                            ) : (
                              <MissingImage
                                text={`${showData.title} ${season.title} Image`}
                              />
                            )}
                          </a>
                        </Link>
                        <div className="content">
                          <div className="inner">
                            <div className="major">
                              <h3>
                                {season.title} (
                                {moment(season.first_aired).year()})
                              </h3>
                            </div>
                            <p>Episodes: {season.aired_episodes}</p>
                            {generateDescription(
                              season.overview,
                              `/shows/${showId}/season/${season.number}`
                            )}
                            <ul className="actions">
                              <li>
                                <Link
                                  href="/shows/[showId]/season/[seasonNumber]"
                                  as={`/shows/${showId}/season/${season.number}`}
                                >
                                  <a className="button">Episodes</a>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </section>
                    );
                  })}
              </section>
              {relatedShowsData && (
                <RelatedShows relatedShowsData={relatedShowsData} />
              )}
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  );
};

export default ShowPage;
