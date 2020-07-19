// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
cloud.init();

// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("DescribeTaskStatusRequest");
  const res = await fetchContract(req, client, event.taskId);

  return res;
}

function fetchContract(req, client, taskId) {
  const params = `{\"Module\":\"CommonMng\",\"Operation\":\"DescribeTaskStatus\",\"TaskId\":${taskId}}`
  req.from_json_string(params);

  return new Promise((resolve,reject) => client.DescribeTaskStatus(req, (errMsg, response) => {
      if (errMsg) {
          reject(errMsg);
      }

      const  result = JSON.parse(response.TaskResult);

      if (result.ContractResId) {
        return resolve(result.ContractResId);
      }

      resolve(fetchContract(req, client, taskId));
  }));
}