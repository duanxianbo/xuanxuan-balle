// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
const {sealResId} = require("./tencentCloudConfig");
cloud.init();

const modeKeywordMap = {
  client: "甲方监护人签字",
  company: "乙方："
}

// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("SignContractByKeywordRequest");
  const {contractResId, accountResId, imageData, mode} = event;
  const keyword = modeKeywordMap[mode || 'client'];
  
  const params = `{\"Module\":\"ContractMng\",\"Operation\":\"SignContractByKeyword\",\"ContractResId\":\"${contractResId}\",\"AccountResId\":\"${accountResId}\",\"SealResId\":\"${imageData ? "" : sealResId}\",\"SignKeyword\":{\"Keyword\":\"${keyword}\"},\"ImageData\":\"${imageData}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.SignContractByKeyword(req, (errMsg, response) => {
      if (errMsg) {
         reject(errMsg);
      }
  
      resolve(response);
  }));


}