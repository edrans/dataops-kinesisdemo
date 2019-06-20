'use strict';
var AWS = require('aws-sdk');


console.log('Loading function');
exports.handler = (event, context, callback) => {
  let records = 0;

    event.records.forEach((record => {

      records++;
      const payload =  new Buffer(record.data,'base64').toString('ascii');
      var docClient  = new AWS.DynamoDB.DocumentClient();
      var table = "user-quadrant-data";
      var data = JSON.parse(payload);
      console.log(data);
      var params = {
        TableName: table,
        Item: {
          "dataType": "quadrantRollup",
          "windowtime": (new Date(data.WINDOW_TIME)).getTime(),
          //"windowtime": (new Date().getTime()),
          //"windowtime": data.TIME_STR,
          "userCount": data.UNIQUE_USER_COUNT,
          "androidCount": data.ANDROID_COUNT,
          "iosCount": data.IOS_COUNT,
          "windowsCount": data.WINDOWS_PHONE_COUNT,
          "otherOSCount": data.OTHER_OS_COUNT,
          "quadrantA": data.QUADRANT_A_COUNT,
          "quadrantB": data.QUADRANT_B_COUNT,
          "quadrantC": data.QUADRANT_C_COUNT,
          "quadrantD": data.QUADRANT_D_COUNT
        }
      };
      console.log(params);
      docClient.put(params,function(err,data) {
            console.log(err);
      });
    }));
    callback(null, {
        records: records,
    });
};
