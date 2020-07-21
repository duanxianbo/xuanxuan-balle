// 云函数入口文件
const cloud = require('wx-server-sdk')
const {uploadPdf} = require("./uploadPdf");
const {uploadContract} = require("./uploadContract");
cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const contractName = `${OPENID}-${event.parentsName}`;
  
  const res = await uploadPdf(event, contractName, cloud);
  
  const downloadRes =  await cloud.getTempFileURL({
    fileList: [res.fileID],
  });

  const {TaskId} = await uploadContract(contractName, downloadRes.fileList[0].tempFileURL, event.accountResId);

  return {...res, taskId: TaskId};
}