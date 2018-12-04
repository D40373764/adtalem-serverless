'use strict';

const assert = require('chai').assert;
const gpa = require('../handler').gpa;
const accountSummary = require('../handler').accountSummary;
const currentTerm = require('../handler').currentTermDate;
const emailCount = require('../handler').emailCount;

const event = {
  "messageVersion": "1.0",
  "invocationSource": "FulfillmentCodeHook",
  "userId": "user-1",
  "sessionAttributes": {},
  "bot": {
    "name": "StudetnBot",
    "alias": "$LATEST",
    "version": "$LATEST"
  },
  "inputTranscript": "123",
  "outputDialogMode": "Text",
  "currentIntent": {
    "name": "GPA",
    "slots": {
      "Username": "D40369400"
    },
    "confirmationStatus": "None"
  }
}

describe('handler', function () {
  this.timeout(6000);

  it('gpa test', function (done) {
    gpa(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        console.log(JSON.stringify(message));
        assert.isObject(message);
      }
      done();    
    });
  });

  it('account summary test', function (done) {
    accountSummary(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        assert.isObject(message);
      }
      done();    
    });
  });

  it('current term test', function (done) {
    currentTerm(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        assert.isObject(message);
      }
      done();    
    });
  });

  it('email count test', function (done) {
    emailCount(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        console.log(message);
        assert.isObject(message);
      }
      done();    
    });
  });

});