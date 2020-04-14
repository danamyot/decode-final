import { useRouter } from "next/router";
import useSWR from "swr";

import Layout from "components/Layout";
import ShowList from "components/ShowList";
import fetcher from "services/fetcher";
import { arrayCapitalize } from "utils/helpers";

import { BASE_API_URL } from "config/dev.config.json";

const ListPage = ({ initialData }) => {
  const router = useRouter();
  const { listCategory: category } = router.query;

  const { data } = useSWR(
    `${BASE_API_URL}/api/top-shows?category=${category}&limit=48`,
    fetcher,
    {
      initialData
    }
  );

  const generateTitle = category => {
    if (category === "watched") {
      category = "most watched";
    }
    return `${arrayCapitalize(category.split(" ")).join(" ")} Shows`;
  };

  return (
    <Layout pageName="index">
      <div id="main">
        <section id="one" className="trending-shows tiles">
          <div className="inner">
            <ShowList data={data} listTitle={generateTitle(category)} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

ListPage.getInitialProps = async function({ query }) {
  const data = await fetcher(
    `${BASE_API_URL}/api/top-shows?category=${query.listCategory}&limit=48`
  );

  return { initialData: data };
};

export default ListPage;
