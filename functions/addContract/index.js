// 云函数入口文件
const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit');    

cloud.init()

// 云函数入口函数
exports.main =  (event, context) => {
  const { name, sex, birth, parentsName, parentsIdcard, phone, user, email} = event;
  const { OPENID } = cloud.getWXContext();


return new Promise((resolve, reject) => {
  var doc = new PDFDocument();

  doc.font(`${__dirname}/msyh.ttf`)
  // draw some text
  doc.fontSize(25).text("课程服务合同", 100, 80);
  doc.fontSize(25).text("甲方（受教育方）：学生姓名", 0, 25);

  // some vector graphics
  doc
    .save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill('#FF3300');
  
  doc.circle(280, 200, 50).fill('#6600FF');
  
  // an SVG path
  doc
    .scale(0.6)
    .translate(470, 130)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();
  
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    doc.on('error', reject);
    doc.on('end', () => {
      
       resolve(cloud.uploadFile({
        cloudPath: `${OPENID}-contract.pdf`,
        fileContent:  Buffer.concat(buffers),
      }));



     


    
    
        // ... now send pdfData as attachment ...
    
    });
  
  // end and display the document in the iframe to the right
  doc.end();
})


}