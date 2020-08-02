// 云函数入口文件
const cloud = require('wx-server-sdk')
const {downloadContract} = require('./downloadContract');
const request = require('request');
cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const taskId = await downloadContract(event.contractResId);
  const { OPENID } = cloud.getWXContext();
  const contractName = `${OPENID}-${event.parentsName}`;

  let res;

  try {
  res = await cloud.callFunction({
    name: 'getContract',
    data: {
      taskId,
      mode: "download"
    }
  });
 } catch (error) {
   throw error;
 }

 const imageData = await new Promise((resolve, reject) => request({
  url: res.result,
  encoding: null
}, (err, _resp, buffer) => {
  if (err) {
    reject(err);
  }

  resolve(buffer);
}));

cloud.uploadFile({
  cloudPath: `contract/${contractName}.pdf`,
  fileContent: imageData
})




}