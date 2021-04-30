import { API_URL } from "container/constant/storage";
import { getItem } from "container/utils/storage";
// const server = "192.168.0.122:8888";
// const server = "113.172.236.109:1000";
// const server = "192.168.0.109:8888";
const server = "tanca.ddns.net:8887";
//android emulator server
//
const Config = () => {
  const development = {
    API_URL: `http://${server}/api/`,
    API_IMAGE: `http://${server}/files/images/`,
  };
  return development;
};

export default Config();

export const formatURL = (apiURL) => {
  return `http://${apiURL}/api/`;
};
