// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
const {companyAccountId} = require("./tencentCloudConfig");
cloud.init();


// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("SendVcodeRequest");
  const {contractResId, accountResId} = event;
  
  const params = `{\"Module\":\"VerifyCode\",\"Operation\":\"SendVcode\",\"ContractResId\":\"${contractResId}\",\"AccountResId\":\"${accountResId || companyAccountId}\"}`
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.SendVcode(req, (errMsg, response) => {
      if (errMsg) {
         reject(errMsg.message);
      }
  
      resolve(response);
  }));


}