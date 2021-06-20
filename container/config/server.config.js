import { API_URL } from "container/constant/storage";
import { getItem } from "container/utils/storage";
const server = "103.151.241.11:8888";
// const server = "113.172.236.109:1000";
// const server = "10.0.2.2:8888"; //android emulator
// const server = "localhost:8888"; //ios emulator
// const server = "tanca.ddns.net:8887";
//android emulator server
//

global.env = process.env.NODE_ENV;

if (global.env == "production") {
  console.log = () => {};
}

const Config = () => {
  const { club } = global.organization || {};
  const clubId = club && club.id ? club.id : null;

  const development = {
    API_URL: `http://${server}/api/`,
    API_IMAGE: `http://${server}/clubs/${clubId}/images/`,
  };
  return development;
};

export default Config;

export const formatURL = (apiURL) => {
  return `http://${apiURL}/api/`;
};
