import axios from "axios";

async function fetcher(...args) {
  const res = await axios.get(...args);
  return res.data;
}

export default fetcher;
