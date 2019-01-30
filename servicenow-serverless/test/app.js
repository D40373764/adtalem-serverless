'use strict';

const handler = require('../handler');

const event = {
  "messageVersion": "1.0",
  "invocationSource": "DialogCodeHook",
  "userId": "user-1",
  "sessionAttributes": {},
  "bot": {
    "name": "ServiceNowQnABot",
    "alias": "$LATEST",
    "version": "$LATEST"
  },
  "inputTranscript": "123",
  "outputDialogMode": "Text",
  "currentIntent": {
    "name": "ITSM_Incidents",
    "slots": {
      "Username": "D40373764",
      "Incident_Number": "INC00744532",
      "Request_Number": "REQ00238463",
      "Ritm_Number": "RITM00035796",
      "Call_Number": "CALL0289172"
    },
    "confirmationStatus": "None"
  }
}

// handler.getIncidentsByDsi(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getIncidentByNumber(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getRequestsByDsi(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getRequestByNumber(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getRitmByDsi(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getRitmByNumber(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

// handler.getCallsByDsi(event, null, function (error, message) {
//   if (error != undefined) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(message));
//   }
// });

handler.getCallByNumber(event, null, function (error, message) {
  console.log(error ? error : JSON.stringify(message));
});