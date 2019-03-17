function doPost(e) {
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function(event) {
    if(event.type == "message") {
      reply(event);
    } else if(event.type == "follow") {
      follow(event);
    } else if(event.type == "unfollow") {
      unFollow(event);
    }
 });
}

function reply(e) {
  var message = {
    "replyToken" : e.replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : ((e.message.type=="text") ? e.message.text : "Text")
      }
    ]
  };

  var replyData = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer" + "LINEAPI_Access_Token"
    },
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);
}

function follow(e){
  var spreadsheet = SpreadsheetApp.openById('spreadsheet_key');  
  var sheet = spreadsheet.getActiveSheet(); 
  sheet.appendRow([e.source.userId]); 
}

function unFollow(e){
  var spreadsheet = SpreadsheetApp.openById('spreadsheet_key'); 
  var sheet = spreadsheet.getActiveSheet();
  var result = findRow(sheet,e.source.userId,1);
  if(result > 0){
    sheet.deleteRows(result);
  }
}

function findRow(sheet,val,col){
 
  var data=sheet.getDataRange().getLastRow();
 
  for(var i=1;i<=data;i++){
    if(sheet.getRange(i,col).getValue() === val){
      return i;
    }
  }
  return 0;
}
