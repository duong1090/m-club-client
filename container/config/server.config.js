const server = "172.168.81.221:8888";
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
