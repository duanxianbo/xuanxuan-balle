// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
const {sealResId} = require("./tencentCloudConfig");
cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("SignContractByKeywordRequest");
  const {contractResId, accountResId, keyword, imageData} = event;
  
  const params = `{\"Module\":\"ContractMng\",\"Operation\":\"SignContractByKeyword\",\"ContractResId\":\"${contractResId}\",\"AccountResId\":\"${imageData ? accountResId : ""}\",\"SealResId\":\"${sealResId}\",\"SignKeyword\":{\"Keyword\":\"${keyword}\"},\"ImageData\":\"${imageData}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.SignContractByKeyword(req, (errMsg, response) => {
      if (errMsg) {
         reject(errMsg);
      }
  
      resolve(response);
  }));


}