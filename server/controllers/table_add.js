const { mysql } = require('../qcloud')

//Create Table

module.exports = async ctx => {
  var myDate = new Date();
  var newDate=myDate.toLocaleDateString()
  console.log(newDate);
 var body = ctx.request.body.tab
// console.log(body)
  var data = JSON.parse(body);

await mysql.schema.hasTable(newDate).then(function (exists) {
  if (!exists) {
    console.log("not exist")
    //   return mysql.schema.createTable("test_table", function (table) {
    //   table.string('user');
    //   table.string('password');
    //   table.string('name');
    //   table.integer('class');
    //   table.string('openId');
    // });
    // console.log("1");
    //   return mysql.batchInsert('test_table',data);
      
 
  }else{
    console.log("exist")
      
      return mysql.schema.dropTable(newDate);
    //   console.log("1");
    //   return mysql.schema.createTable("test_table", function (table) {
    //   table.string('user');
    //   table.string('password');
    //   table.string('name');
    //   table.integer('class');
    //   table.string('openId');
    // });
    // console.log("2");
    //   return mysql.batchInsert('test_table', data);
    // console.log("3");
  }
});
  
  await mysql.schema.createTable(newDate, function (table) {
    table.string('user');
    table.string('password');
    table.string('name');
    table.integer('class');
    table.string('openId');
  });
  
  await mysql.batchInsert(newDate, data);
  


}

