import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";
import Slider from "react-slick";

import Layout from "components/Layout";
import Banner from "components/Banner";
import ShowCard from "components/ShowCard";
import MissingImage from "components/MissingImage";
import fetcher from "services/fetcher";
import { arrayCapitalize, generateDescription } from "utils/helpers";

import ProfileSVG from "public/images/profile.svg";

import { BASE_TVDB_IMG_URL, BASE_API_URL } from "config/dev.config.json";

const ShowPage = ({ initialShowData }) => {
  const router = useRouter();
  const { showId } = router.query;

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

  const castSliderSettings = {
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 980, // medium breakpoint
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 480, // xsmall breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  };

  const relatedSliderSettings = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 736, // small breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 480, // xsmall breakpoint
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  const findSeasonImage = (season, imageData) => {
    return (
      imageData &&
      imageData.find(seasonImage => seasonImage.subKey === `${season.number}`)
        .fileName
    );
  };

  return (
    <Layout pageName="show-id">
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
              <div className="show-trailer">
                {showData.trailer && (
                  <>
                    <h4>Trailer</h4>
                    <div className="trailer-container">
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          showData.trailer.split("?v=")[1]
                        }`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
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
                        {castMember.image ? (
                          <div
                            style={{
                              backgroundImage: `URL(${BASE_TVDB_IMG_URL}/${castMember.image})`
                            }}
                            className="cast-member-img"
                          ></div>
                        ) : (
                          <div className="cast-member-img default-img">
                            <ProfileSVG />
                          </div>
                        )}
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
          <section id="three" className="seasons spotlights">
            {showData.seasons
              .filter(season => season.number > 0 && season.first_aired)
              .map(season => {
                const seasonImage = findSeasonImage(
                  season,
                  showData.imageData.season
                );

                return (
                  <section key={season.number}>
                    <Link
                      href={`/shows/${router.query.showId}/season/${season.number}`}
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
                            {season.title} ({moment(season.first_aired).year()})
                          </h3>
                        </div>
                        <p>Episodes: {season.aired_episodes}</p>
                        {generateDescription(
                          season.overview,
                          `/shows/${router.query.showId}/season/${season.number}`
                        )}
                        <ul className="actions">
                          <li>
                            <Link
                              href={`/shows/${router.query.showId}/season/${season.number}`}
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
            <section id="four" className="related-shows">
              <div className="inner">
                <header className="major">
                  <h2>Related Shows</h2>
                </header>
                <Slider {...relatedSliderSettings}>
                  {relatedShowsData.map(show => (
                    <div key={show.ids.trakt} className="related-show-slide">
                      <ShowCard key={show.ids.trakt} show={show} />
                    </div>
                  ))}
                </Slider>

                <div className="show-card-container"></div>
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const [showData] = await Promise.all([
    await fetcher(`${BASE_API_URL}/api/show-info?id=${query.showId}`)
  ]);

  return {
    initialShowData: showData
  };
};

export default ShowPage;
