

const { companyAccountId } = require("./tencentCloudConfig");
const {initTencentCloudRequest} = require("./tencentCloudHelper");

exports.uploadContract = async (contactName, ContractFile, userAccountId) => {
  const { req, client } = initTencentCloudRequest("CreateContractByUploadRequest");
  const params = `{\"Module\":\"ContractMng\",\"Operation\":\"CreateContractByUpload\",\"SignInfos\":[{\"AccountResId\":\"${companyAccountId}\"}, {\"AccountResId\":\"${userAccountId}\"}],\"ContractName\":\"${contactName}\", \"ContractFile\": \"${ContractFile}\"}`
  req.from_json_string(params);

  return new Promise((resolve, reject) => {
    client.CreateContractByUpload(req,  (errMsg, response) => {
      if (errMsg) {
        reject(errMsg.message);
        return;
      }
  
      resolve(response);
    });
  })



}