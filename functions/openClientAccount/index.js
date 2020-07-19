// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
cloud.init();


// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("CreatePersonalAccountRequest");
  const {parentsName, parentsIdcard, phone} = event;

  const params = `{\"Module\":\"AccountMng\",\"Operation\":\"CreatePersonalAccount\",\"Name\":\"${parentsName}\",\"IdentType\":0,\"IdentNo\":\"${parentsIdcard}\",\"MobilePhone\":\"${phone}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.CreatePersonalAccount(req, (errMsg, response) => {
      if (errMsg) {
          reject(errMsg);
      }
  
      resolve(response.AccountResId);
  }));
}