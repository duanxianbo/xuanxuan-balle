const PDFDocument = require('pdfkit');
const {detailRules, otherContractRules, contractRules,  companyName,
  rulesTitle,    contractRuleOneTitle,
  contractRuleOneContent,
  signaturePositions,
  contractTtile} = require('./config');
const now = new Date();

const year = now.getFullYear();
const month = now.getMonth() + 1;
const date = now.getDate();

exports.uploadPdf = (event, contractName, cloud) => {
  const { name, sex, birth, parentsName, parentsIdCard, classNumber, totalPrice } = event;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    doc.registerFont('Heading Font', `${__dirname}/Alibaba-PuHuiTi-Heavy.ttf`);
    doc.registerFont('Normal Font', `${__dirname}/Alibaba-PuHuiTi-Regular.ttf`);
    doc.font("Heading Font")
    .lineGap(10).fontSize(15).text(contractTtile, {align: "center"});
    
    doc.fontSize(12).font("Normal Font").text("甲方（受教育方）：学生姓名 ", {continued: true})
    .text(name, {underline: true, continued: true})
    .text("; 性别 ", {continued: true})
    .text(sex, {underline: true, continued: true})
    .text("; 出生年月 ", {continued: true})
    .text(birth, {underline: true, continued: true})
    .text(";");
   
    doc.text("甲方监护人 : 姓名 ", {continued: true})
    .text(parentsName, {underline: true, continued: true})
    .text("; 身份证号码 ", {continued: true})
    .text(parentsIdCard, {underline: true, continued: true})
    .text(";");
  
    doc.text("乙方 ", {continued: true})
    .text(companyName, {underline: true})
    
    doc.text(contractRules);

    doc.font('Heading Font').text(contractRuleOneTitle);
    doc.font('Normal Font').text(contractRuleOneContent, {continued: true})
    .text(classNumber, {underline: true, continued: true})
    .text("课时（45分钟/课时)");
    
    doc.text("3、课程费用总计：", {continued: true})
    .text(totalPrice,{underline: true, continued: true})
    .text("元。");

    otherContractRules.forEach((contractRule) => {
      doc.font('Heading Font').text(contractRule.title);
      doc.font('Normal Font').text(contractRule.content);
    })
  

    doc.moveDown(2);
    doc.fontSize(15).font('Heading Font').text(rulesTitle, {align: "center"});

    doc.fontSize(12);

    detailRules.forEach((contractRule) => {
      doc.font('Heading Font').text(contractRule.title);
      doc.font('Normal Font').text(contractRule.content);
    })

    doc.text(signaturePositions);

    doc.text(`日期 ${year} 年 ${month} 月 ${date} 日                                                                  日期 ${year} 年 ${month} 月 ${date} 日`);

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