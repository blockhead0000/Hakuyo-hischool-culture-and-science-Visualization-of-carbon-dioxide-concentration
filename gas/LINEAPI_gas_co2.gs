function push(message) {
  var spreadsheet = SpreadsheetApp.openById('spreadsheet_key');
  var sheet = spreadsheet.getActiveSheet(); 
  var data = sheet.getDataRange().getValues(); 
  var userlist = []; 
  for(var i=0; i < data.length; i++){
    userlist.push(data[i][0]);
  }
  var postData = {
    "to" : userlist, 
    "messages" : [
      {
        "type" : "text",
        "text" : message
      }
    ]
  };
  var options_push = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + "LINEAPI_Access_Token"
    },
    "payload" : JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/multicast", options_push);
}@

function onEdit(e) {
 
  var spreadsheet = SpreadsheetApp.openById('spreadsheet_key');  
  var sheet = spreadsheet.getActiveSheet(); 
  push(sheet.getRange("C1").getValue());
}