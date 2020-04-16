import searchResultsReducer from "./searchResultsReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  searchResults: searchResultsReducer
});

export default rootReducer;
