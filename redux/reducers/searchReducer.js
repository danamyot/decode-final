import { SET_SEARCH_RESULTS, SET_SEARCH_QUERY } from "../actions/searchActions";

const searchReducer = (
  state = { searchResults: "", searchQuery: "" },
  action
) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.value };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.value };
    default:
      return { ...state };
  }
};

export default searchReducer;
