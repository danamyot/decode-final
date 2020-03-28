import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";
import Slider from "react-slick";

import Layout from "components/Layout";
import Banner from "components/Banner";
import ShowCard from "components/ShowCard";
import fetcher from "services/fetcher";
import { arrayCapitalize } from "utils/helpers";

const BASE_API_URL = "http://localhost:3000";
const BASE_TVDB_IMG_URL = "https://artworks.thetvdb.com/banners";

const ShowPage = ({ initialData }) => {
  const router = useRouter();

  const { data: seasonData } = useSWR(
    `${BASE_API_URL}/api/season-info?id=${router.query.showId}&seasonNumber=${router.query.seasonNumber}`,
    fetcher,
    {
      initialData: initialData
    }
  );

  process.browser && console.log(seasonData);

  const bannerSubHeader =
    seasonData.showInfo &&
    `Aired: ${moment(seasonData.first_aired).year()} | ${
      seasonData.showInfo.network
    } | ${seasonData.showInfo.certification}`;

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

  return (
    <Layout pageName="season-id">
      <Head>
        <title>
          {`${seasonData.title} | ${seasonData.showInfo.title}`} | Trakr.tv
        </title>
        <meta
          name="description"
          content={`${seasonData.showInfo.title} ${seasonData.title}. ${seasonData.overview}`}
        />
      </Head>
      <div>
        <Banner heading={`${seasonData.title}`} subHeading={bannerSubHeader} />

        <div id="main">
          <section id="one" className="show-info">
            <div className="inner">
              <div>
                <header className="major">
                  <h2>Overview</h2>
                </header>
                <p>{`Total Episodes: ${seasonData.aired_episodes}`}</p>
                <p>{seasonData.overview}</p>
              </div>
            </div>
          </section>
          <section id="two" className="episodes spotlights">
            {seasonData.episodes.map((episode, i) => (
              <section key={episode.number}>
                <Link
                  href={`/shows/${router.query.showId}/season/${router.query.seasonNumber}/episode/${episode.number}`}
                >
                  <a className="image">
                    <img
                      src={`${BASE_TVDB_IMG_URL}/${seasonData.imageData.episodes[i]}`}
                      alt={`${seasonData.title} Episode ${episode.number}`}
                    />
                  </a>
                </Link>
                <div className="content">
                  <div className="inner">
                    <h4>Episode {episode.number}</h4>
                    <header className="major">
                      <h3>{episode.title}</h3>
                    </header>
                    <p>
                      Runtime: {episode.runtime}m
                      <br />
                      {moment(episode.first_aired)
                        .utc()
                        .format("YYYY-MM-DD")}
                    </p>
                    <p>{episode.overview}</p>
                    <ul className="actions">
                      <li>
                        <Link
                          href={`/shows/${router.query.showId}/season/${router.query.seasonNumber}/episode/${episode.number}`}
                        >
                          <a>More</a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            ))}
          </section>
          {/* <section id="four" className="related-shows">
            <div className="inner">
              <header className="major">
                <h2>Related Shows</h2>
              </header>
              {relatedShowsData && (
                <Slider {...relatedSliderSettings}>
                  {relatedShowsData.map(show => (
                    <div className="related-show-slide">
                      <ShowCard key={show.ids.trakt} show={show} />
                    </div>
                  ))}
                </Slider>
              )}
              <div className="show-card-container"></div>
            </div>
          </section> */}
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const data = await fetcher(
    `${BASE_API_URL}/api/season-info?id=${query.showId}&seasonNumber=${query.seasonNumber}`
  );

  return {
    initialData: data
  };
};

export default ShowPage;
