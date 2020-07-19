const {initTencentCloudRequest} = require("./tencentCloudHelper");

module.exports.downloadContract = function (contractResId) {
  const {req, client} = initTencentCloudRequest("DownloadContractRequest");
  const params = `{\"Module\":\"ContractMng\",\"Operation\":\"DownloadContract\",\"ContractResId\":\"${contractResId}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.DownloadContract(req, (errMsg, response) => {
      if (errMsg) {
         reject(errMsg);
      }
  
      resolve(response.TaskId);
  }));
}