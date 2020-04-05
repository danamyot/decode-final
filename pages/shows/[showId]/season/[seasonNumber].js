import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";

import Layout from "components/Layout";
import Banner from "components/Banner";
import fetcher from "services/fetcher";
import { generateDescription } from "utils/helpers";

import { BASE_TVDB_IMG_URL, BASE_API_URL } from "config/dev.config.json";

const ShowPage = ({ initialData }) => {
  const router = useRouter();
  const { showId, seasonNumber } = router.query;

  const { data: seasonData } = useSWR(
    `${BASE_API_URL}/api/season-info?id=${showId}&season=${seasonNumber}`,
    fetcher,
    {
      initialData
    }
  );

  process.browser && console.log(seasonData);

  const bannerSubHeader =
    seasonData.showInfo && `Aired: ${moment(seasonData.first_aired).year()}`;

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
        <Banner
          preHeading={seasonData.showInfo.title}
          preHeadingLink={`/shows/${showId}`}
          heading={`${seasonData.title}`}
          subHeading={bannerSubHeader}
        />

        <div id="main">
          <section id="one" className="season-info">
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
                  href={`/shows/${showId}/season/${seasonNumber}/episode/${episode.number}`}
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
                      <Link
                        href={`/shows/${showId}/season/${seasonNumber}/episode/${episode.number}`}
                      >
                        <a className="h3">{episode.title}</a>
                      </Link>
                    </header>
                    <p>
                      Runtime: {episode.runtime}m
                      <br />
                      {moment(episode.first_aired)
                        .utc()
                        .format("YYYY-MM-DD")}
                    </p>
                    <p>
                      {generateDescription(
                        episode.overview,
                        `/shows/${showId}/season/${seasonNumber}/episode/${episode.number}`
                      )}
                    </p>
                    <ul className="actions">
                      <li>
                        <Link
                          href={`/shows/${showId}/season/${seasonNumber}/episode/${episode.number}`}
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
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const data = await fetcher(
    `${BASE_API_URL}/api/season-info?id=${query.showId}&season=${query.seasonNumber}`
  );

  return {
    initialData: data
  };
};

export default ShowPage;
