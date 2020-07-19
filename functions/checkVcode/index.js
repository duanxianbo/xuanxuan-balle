// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
cloud.init();


// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("CheckVcodeRequest");
  const {accountResId, contractResId, code} = event;
  
  const params = `{\"Module\":\"VerifyCode\",\"Operation\":\"CheckVcode\",\"AccountResId\":\"${accountResId}\",\"ContractResId\":\"${contractResId}\",\"VerifyCode\":\"${code}\"}`;
  req.from_json_string(params);
  
  return new Promise((resolve, reject) => client.CheckVcode(req, (errMsg, response) => {
      if (errMsg) {
         reject(errMsg);
      }
  
      resolve(response);
  }));


}