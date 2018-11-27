'use strict';

const assert = require('chai').assert;
const oktaLogin = require('../handler').oktaLogin;
const authentication = require('../handler').authentication;

const event = {
  "messageVersion": "1.0",
  "invocationSource": "FulfillmentCodeHook",
  "userId": "user-1",
  "sessionAttributes": {},
  "bot": {
    "name": "CUQABot",
    "alias": "$LATEST",
    "version": "$LATEST"
  },
  "inputTranscript": "123",
  "outputDialogMode": "Text",
  "currentIntent": {
    "name": "OKTA_AUTHN",
    "slots": {
      "Username": "D12345678",
      "Password": "xxxxxxxx"
    },
    "confirmationStatus": "None"
  }
}

describe('handler', function () {
  this.timeout(6000);

  it('oktaLogin test', function (done) {
    oktaLogin(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        assert.isObject(message);
      }
      done();    
    });
  });

  it('authentication test', function (done) {
    authentication(event, null, function (error, message) {
      if (error != undefined) {
        assert.fail(error);
      } else {
        assert.isObject(message);
      }
      done();    
    });
  });
});