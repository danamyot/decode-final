import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import moment from "moment";

import Layout from "components/Layout";
import Banner from "components/Banner";
import fetcher from "services/fetcher";

import { BASE_TVDB_IMG_URL, BASE_API_URL } from "config/dev.config.json";

const ShowPage = ({ initialData }) => {
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
              <div>
                <header className="major">
                  <h2>Overview</h2>
                </header>
                <p>{episodeData.overview}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

ShowPage.getInitialProps = async function({ query }) {
  const data = await fetcher(
    `${BASE_API_URL}/api/episode-info?id=${query.showId}&season=${query.seasonNumber}&episode=${query.episodeNumber}`
  );

  return {
    initialData: data
  };
};

export default ShowPage;
