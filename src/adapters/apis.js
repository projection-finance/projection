import axios from "axios";

const getCoins = () => {
  return axios.get(`https://api.coingecko.com/api/v3/coins/list`);
};
export { getCoins };
