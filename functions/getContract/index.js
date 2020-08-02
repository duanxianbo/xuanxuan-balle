// 云函数入口文件
const cloud = require('wx-server-sdk')
const { initTencentCloudRequest } = require("./tencentCloudHelper");
cloud.init();

const resKeyModeMap = {
  upload: "ContractResId",
  download: "ContractDownloadUrl"
};

// 云函数入口函数
exports.main = async (event) => {
  const { req, client } = initTencentCloudRequest("DescribeTaskStatusRequest");
  const resKey = resKeyModeMap[event.mode || 'upload'];
  const res = await new Promise((resolve, reject) => fetchContract(req, client, event.taskId, resKey, resolve, reject));

  return res;
}
const log = cloud.logger();

function fetchContract(req, client, taskId, resKey, resolve, reject) {
  const params = `{\"Module\":\"CommonMng\",\"Operation\":\"DescribeTaskStatus\",\"TaskId\":${taskId}}`
  req.from_json_string(params);

  client.DescribeTaskStatus(req, (errMsg, response) => {
    if (errMsg) {
      reject(errMsg.message);
    }


    log.info(response)

    if (response.TaskResult !== "Downloading contract") { //todo get a better way to check task status

      const result = JSON.parse(response.TaskResult);

      if (result[resKey]) {
        return resolve(result[resKey]);
      }
    }

    fetchContract(req, client, taskId, resKey, resolve, reject);
  });
}