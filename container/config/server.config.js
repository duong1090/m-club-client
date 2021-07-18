import moment from "moment";

const server = "mclub.ga:8888";

global.env = process.env.NODE_ENV;

if (global.env == "production") {
  console.log = () => {};
}

const Config = () => {
  const { club } = global.organization || {};
  const clubId = club && club.id ? club.id : null;

  const development = {
    API_URL: `http://${server}/api/`,
    API_IMAGE: (imgPath) =>
      `http://${server}/clubs/${clubId}/images/${imgPath}?${moment().unix()}`,
  };
  return development;
};

export default Config;

export const formatURL = (apiURL) => {
  return `http://${apiURL}/api/`;
};
