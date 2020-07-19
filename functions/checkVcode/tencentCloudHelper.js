const tencentcloud = require("tencentcloud-sdk-nodejs");
const { secretId, secretKey, apiEnd, apiLocation } = require("./tencentCloudConfig");

module.exports.initTencentCloudRequest = (requestActiion) => {
  const DsClient = tencentcloud.ds.v20180523.Client;
  const models = tencentcloud.ds.v20180523.Models;

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;

  const cred = new Credential(secretId, secretKey);
  const httpProfile = new HttpProfile();
  httpProfile.endpoint = apiEnd;
  const clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  const client = new DsClient(cred, apiLocation, clientProfile);
  const req = new models[requestActiion]();

  return { 
    req,
    client
  };

}