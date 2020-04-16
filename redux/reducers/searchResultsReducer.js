import { SET_SEARCH_RESULTS } from "../actions/searchResultsActions";

const searchResultsReducer = (state = { searchResults: "" }, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.value };
    default:
      return { ...state };
  }
};

export default searchResultsReducer;
