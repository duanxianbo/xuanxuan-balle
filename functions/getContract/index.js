// 云函数入口文件
const cloud = require('wx-server-sdk')
const {initTencentCloudRequest} = require("./tencentCloudHelper");
cloud.init();

const resKeyModeMap = {
  upload: "ContractResId",
  download: "ContractDownloadUrl"
};

// 云函数入口函数
exports.main = async (event) => {
  const {req, client} = initTencentCloudRequest("DescribeTaskStatusRequest");
  const resKey = resKeyModeMap[event.mode || 'upload'];
  const res = await fetchContract(req, client, event.taskId, resKey);

  return res;
}

function fetchContract(req, client, taskId, resKey) {
  const params = `{\"Module\":\"CommonMng\",\"Operation\":\"DescribeTaskStatus\",\"TaskId\":${taskId}}`
  req.from_json_string(params);

  return new Promise((resolve,reject) => client.DescribeTaskStatus(req, (errMsg, response) => {
      if (errMsg) {
          reject(errMsg.message);
      }

      const  result = JSON.parse(response.TaskResult);

      if (result[resKey]) {
        return resolve(result[resKey]);
      }

      resolve(fetchContract(req, client, taskId, resKey));
  }));
}