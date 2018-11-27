'use strict';

const request = require('request');
const lex = require('lex-serverless');
require('custom-env').env('staging')

const OKTA_API_AUTHN_URL	= process.env.OKTA_API_AUTHN_URL;
const OKTA_API_KEY	      = process.env.OKTA_API_KEY;

/**
 * Call Okta API to login.
 * 
 * @param {*} event 
 * @param {*} callback 
 * @param {*} apiEndpoint 
 */
function dispatchOktaApi(event, callback, apiEndpoint) {

  const username = event.currentIntent.slots.Username;
  const password = event.currentIntent.slots.Password;

  const options = {
    url: apiEndpoint,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': OKTA_API_KEY
    },
    json: {
      'username': username,
      'password': password
    }
  };
    
  request(options, (error, response, body) => {
    let content = '';
    let data = {};
    
    if (!error && response.statusCode == 200) {
      content = 'Login successful';
      data = body._embedded.user.profile;
      data.sessionToken = body.sessionToken;
      data.username = username;
    } else {
      content = 'Invalid username or password';
      data = { 'error' : body.errorSummary };
    }
    
    const message = {
      'contentType': 'CustomPayload',
      'content': content
    }

    callback(null, lex.close(data, 'Fulfilled', message));
  });
}

/**
 * Okta login.
 */
module.exports.oktaLogin = (event, context, callback) => {
  try {
    if (event.currentIntent.confirmationStatus === 'Denied') {

      const message = {
        'contentType': 'PlainText',
        'content': 'Login cancelled.'
      }
      callback(null, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
    }
    dispatchOktaApi(event, callback, OKTA_API_AUTHN_URL);
  } catch (err) {
    callback(err);
  }
};

/**
 * Create message object.
 * 
 * @param {*} message 
 */
const createMessage = (message) => {
  return {
    'contentType': 'PlainText',
    'content': message
  };
}

/**
 * Check if session token exists. If not, ask user to login.
 */
module.exports.authentication = (event, context, callback) => {
  let sessionAttributes = event.sessionAttributes;
  let sessionToken = sessionAttributes.sessionToken;

  if (!sessionToken) {
    event.currentIntent.slots.Username = null;
    event.currentIntent.slots.Password = null;
    callback(null, lex.switchIntent(event.sessionAttributes, event.currentIntent.slots, 'CULogin', 'Login required, continue to login?'));
  }
  else if (event.sessionAttributes.username || event.currentIntent.slots.Username) {
    event.currentIntent.slots.Username = event.currentIntent.slots.Username || event.sessionAttributes.username;
    callback(null, lex.delegate(event.sessionAttributes || {}, event.currentIntent.slots));
  }
  else {
    callback(null, lex.elicitSlot(event.sessionAttributes || {}, event.currentIntent.name, event.currentIntent.slots, 'Username', createMessage('Say or enter username')));
  }
};