// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
const {sealResId, companyAccountId, sealData} = require("./tencentCloudConfig");
cloud.init();


// 云函数入口函数
exports.main = async (event) => {
  const {contractResId, imageData, accountResId} = event;

  return Promise.all([
    {contractResId, accountResId, sealResId: undefined, imageData, keyword: "甲方监护人签字"},
    {contractResId, accountResId: companyAccountId, sealResId, imageData: sealData, keyword: "乙方："}
  ].map(signContract));
}

function signContract({contractResId, accountResId, sealResId, imageData, keyword}) {
  const {req, client} = initTencentCloudRequest("SignContractByKeywordRequest");

  const params = `{\"Module\":\"ContractMng\",\"Operation\":\"SignContractByKeyword\",\"ContractResId\":\"${contractResId}\",\"AccountResId\":\"${accountResId}\",\"SealResId\":\"${imageData ? "" : sealResId}\",\"SignKeyword\":{\"Keyword\":\"${keyword}\",\"OffsetCoordX\":\"0\",\"OffsetCoordY\":\"20\",\"ImageWidth\":\"150\",\"ImageHeight\":\"150\"},\"ImageData\":\"${imageData}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.SignContractByKeyword(req, (errMsg, response) => {
      if (errMsg) {
        if (errMsg.code === "FailedOperation.ContractSignedError") {
          resolve(errMsg.message);
        }

         reject(errMsg.message);
      }
  
      resolve(response);
  }));
}