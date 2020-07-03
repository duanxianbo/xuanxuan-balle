// 云函数入口文件
const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit');
const {detailRules, otherContractRules, contractRules,  companyName,
  rulesTitle,
  contractTtile} = require('./pdfConstants');
cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const { name, sex, birth, parentsName, parentsIdcard, classNumber, totalPrice } = event;
  const { OPENID } = cloud.getWXContext();

  return new Promise((resolve, reject) => {
    var doc = new PDFDocument();

    doc.font(`${__dirname}/msyh.ttf`)
    doc.fontSize(25).text(contractTtile, {align: "center"});
    doc.fontSize(15).text("甲方（受教育方）：学生姓名", 0, undefined);
    doc.moveUp();
    doc.text(name, 200, undefined, {underline: true})
    doc.moveUp();
    doc.text(";性别", 260)
    doc.moveUp();
    doc.text(sex, 300,  undefined, {underline: true})
    doc.moveUp();
    doc.text(";出生年月 ", 320)
    doc.moveUp();
    doc.text(birth, 390, undefined, {underline: true});
    doc.moveUp();
    doc.text(";", 470);
    doc.text("甲方监护人 : 姓名", 0);
    doc.moveUp();
    doc.text(parentsName, 120, undefined, {underline: true});
    doc.moveUp();
    doc.text(";身份证号码 ", 180)
    doc.moveUp();
    doc.text(parentsIdcard, 260, undefined, {underline: true})
    doc.moveUp();
    doc.text(";", 350);
    doc.text("乙方 ", 0);
    doc.moveUp();
    doc.text(companyName, 30, undefined, {underline: true})
    doc.text(contractRules, 0);
    doc.moveUp();
    doc.text(classNumber, 70, undefined, {underline: true});
    doc.moveUp();
    doc.text("课时（45分钟/课时)", 110);
    doc.text("3、课程费用总计：", 0);
    doc.moveUp();
    doc.text(totalPrice, 120, undefined, {underline: true});
    doc.moveUp();
    doc.text("元。", 180);

    doc.text(otherContractRules,  0)

    doc.addPage();
    doc.fontSize(25).text(rulesTitle, {align: "center"});

    doc.fontSize(15).text(detailRules, { align: "justify"});

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', reject);
    doc.on('end', () => {
      resolve(cloud.uploadFile({
        cloudPath: `${OPENID}-contract.pdf`,
        fileContent: Buffer.concat(buffers),
      }));
    });
    doc.end();
  })


}