// const server = "192.168.0.122:8888";
// const server = "113.162.174.50:1000";
const server = "113.162.178.121:1000";
//android emulator server
// const server = "10.0.2.2:8888";

const Config = () => {
  const development = {
    API_URL: `http://${server}/api/`,
    API_IMAGE: `http://${server}/files/images/`,
  };
  return development;
};

export default Config();
