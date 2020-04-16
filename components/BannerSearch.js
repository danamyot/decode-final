import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSearchResults } from "redux/actions/searchResultsActions";

import fetcher from "services/fetcher";

import { BASE_API_URL } from "config/dev.config.json";

const BannerSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async evt => {
    evt.preventDefault();
    let searchResult = await fetcher(
      `${BASE_API_URL}/api/search?query=${query}`
    );
    dispatch(addSearchResults(searchResult));
    router.push("/search");
  };

  return (
    <section id="banner">
      <div className="inner">
        <header className="major">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </form>
        </header>
        <div className="content">
          <p>
            Trakr.tv is better with an account.
            <br />
            Sign up to get started.
          </p>
          <ul className="actions">
            <li>
              <a href="#one" className="button next scrolly">
                Get Started
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BannerSearch;
