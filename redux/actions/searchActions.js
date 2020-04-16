export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS";
export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";

export const setSearchResults = (results) => ({
  type: SET_SEARCH_RESULTS,
  value: results,
});

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  value: query,
});
