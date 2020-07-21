const PDFDocument = require('pdfkit');
const {detailRules, otherContractRules, contractRules,  companyName,
  rulesTitle,
  contractTtile} = require('./config');

exports.uploadPdf = (event, contractName, cloud) => {
  const { name, sex, birth, parentsName, parentsIdCard, classNumber, totalPrice } = event;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    doc.font(`${__dirname}/msyh.ttf`)
    .lineGap(10);
    doc.fontSize(25).text(contractTtile, {align: "center"});
    doc.fontSize(12).text("甲方（受教育方）：学生姓名", 80);
    doc.moveUp();
    doc.text(name, 280, undefined, {underline: true})
    doc.moveUp();
    doc.text(";性别", 330)
    doc.moveUp();
    doc.text(sex, 370,  undefined, {underline: true})
    doc.moveUp();
    doc.text(";出生年月 ", 390)
    doc.moveUp();
    doc.text(birth, 460, undefined, {underline: true});
    doc.moveUp();
    doc.text(";", 540);
    doc.moveDown();
    doc.text("甲方监护人 : 姓名", 80);
    doc.moveUp();
    doc.text(parentsName, 210, undefined, {underline: true});
    doc.moveUp();
    doc.text(";身份证号码 ", 270)
    doc.moveUp();
    doc.text(parentsIdCard, 360, undefined, {underline: true})
    doc.moveUp();
    doc.text(";", 540);
    doc.moveDown();
    doc.text("乙方 ", 80);
    doc.moveUp();
    doc.text(companyName, 110, undefined, {underline: true})
    doc.text(contractRules, 80);
    doc.text()
    doc.moveUp();
    doc.text(classNumber, 150, undefined, {underline: true});
    doc.moveUp();
    doc.text("课时（45分钟/课时)",200);
    doc.text("3、课程费用总计：", 80);
    doc.moveUp();
    doc.text(totalPrice, 180, undefined, {underline: true});
    doc.moveUp();
    doc.text("元。", 260);

    doc.text(otherContractRules,  80);
    doc.moveDown(2);
    doc.fontSize(20).text(rulesTitle, {align: "center"});

    doc.fontSize(12).text(detailRules, { align: "justify"});

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', reject);
    doc.on('end', () => {
      resolve(cloud.uploadFile({
        cloudPath: `contract/${contractName}.pdf`,
        fileContent: Buffer.concat(buffers),
      }));
    });
    doc.end();
  })


}