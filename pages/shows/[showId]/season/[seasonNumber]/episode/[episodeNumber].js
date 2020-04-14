import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";

import Banner from "components/Banner";
import Layout from "components/Layout";
import fetcher from "services/fetcher";

import { BASE_TVDB_IMG_URL, BASE_API_URL } from "config/dev.config.json";

const EpisodePage = ({ initialData }) => {
  const router = useRouter();
  const { showId, seasonNumber, episodeNumber } = router.query;

  const { data: episodeData } = useSWR(
    `${BASE_API_URL}/api/episode-info?id=${showId}&season=${seasonNumber}&episode=${episodeNumber}`,
    fetcher,
    {
      initialData
    }
  );

  process.browser && console.log(episodeData);

  const bannerSubHeader =
    episodeData.showInfo &&
    `Aired: ${moment(episodeData.first_aired)
      .utc()
      .format("LL")} | Season: ${episodeData.season} | Episode: ${
      episodeData.number
    }`;

  return (
    <Layout pageName="episode-id">
      <Head>
        <title>
          {`${episodeData.title} | ${episodeData.showInfo.title}`} | Trakr.tv
        </title>
        <meta
          name="description"
          content={`${episodeData.showInfo.title} Season ${episodeData.season} Episode ${episodeData.number}. ${episodeData.overview}`}
        />
      </Head>
      <div>
        <Banner
          preHeading={episodeData.showInfo.title}
          preHeadingLink={`/shows/${showId}`}
          heading={`${episodeData.title}`}
          subHeading={bannerSubHeader}
          background={`${BASE_TVDB_IMG_URL}/${episodeData.filename}`}
        />

        <div id="main">
          <section id="one" className="episode-info">
            <div className="inner">
              <div className="episode-image">
                <img
                  src={`${BASE_TVDB_IMG_URL}/${episodeData.filename}`}
                  alt={`${episodeData.showInfo.title} Season ${episodeData.season} Episode ${episodeData.number}`}
                />
              </div>
              <div className="episode-info">
                <header className="major">
                  <h2>Overview</h2>
                </header>
                <p>Runtime: {episodeData.runtime}m</p>
                <p>Directed by: {episodeData.directors.join(", ")}</p>
                <p>Written by: {episodeData.writers.join(", ")}</p>
                {episodeData.guestStars.length > 0 && (
                  <p>Guest stars: {episodeData.guestStars.join(", ")}</p>
                )}
              </div>
              <div className="episode-description">
                <h5>Description</h5>
                <p>{episodeData.overview}</p>
              </div>
            </div>
          </section>
          <section id="two" className="previous-next-episodes">
            {episodeData.previousEpisode.number && (
              <Link
                href={`/shows/${showId}/season/${episodeData.previousEpisode.season}/episode/${episodeData.previousEpisode.number}`}
              >
                <a className="previous-episode">
                  <img
                    src={`${BASE_TVDB_IMG_URL}/${episodeData.previousEpisode.filename}`}
                    alt={`Season ${episodeData.previousEpisode.season} Episode ${episodeData.previousEpisode.number}`}
                  />
                  <p className="episode-number">{`Season ${episodeData.previousEpisode.season} Episode ${episodeData.previousEpisode.number}`}</p>
                  <p className="episode-name">
                    {episodeData.previousEpisode.title}
                  </p>
                </a>
              </Link>
            )}
            {episodeData.nextEpisode.number && (
              <Link
                href={`/shows/${showId}/season/${episodeData.nextEpisode.season}/episode/${episodeData.nextEpisode.number}`}
              >
                <a className="next-episode">
                  <img
                    src={`${BASE_TVDB_IMG_URL}/${episodeData.nextEpisode.filename}`}
                    alt={`Season ${episodeData.nextEpisode.season} Episode ${episodeData.nextEpisode.number}`}
                  />
                  <p className="episode-number">{`Season ${episodeData.nextEpisode.season} Episode ${episodeData.nextEpisode.number}`}</p>
                  <p className="episode-name">
                    {episodeData.nextEpisode.title}
                  </p>
                </a>
              </Link>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

EpisodePage.getInitialProps = async function({ query }) {
  const data = await fetcher(
    `${BASE_API_URL}/api/episode-info?id=${query.showId}&season=${query.seasonNumber}&episode=${query.episodeNumber}`
  );

  return {
    initialData: data
  };
};

export default EpisodePage;
