'use strict';

const request = require('request');
const lex = require('lex-serverless');
require('custom-env').env('staging')

const CHAMBERLAIN_API_URL	= process.env.CHAMBERLAIN_API_URL;
const CHAMBERLAIN_API_KEY	= process.env.CHAMBERLAIN_API_KEY;
const CHAMBERLAIN_API_DSI	= process.env.CHAMBERLAIN_API_DSI;
const regex = /^[D][0-9]{8}$/;

/**
 * Check DSI format.
 * @param {*} studentId 
 */
function isDsiValid(studentId) {
  return regex.exec(studentId) == null ? false : true;
}

/**
 * Invalid username. Ask user to try again.
 */
function rejectUsername(event, callback) {
  let message = {
    'contentType': 'PlainText',
    'content': `Sorry! Invalid input. Please try again!`
  }

  callback(null, lex.elicitSlot(event.sessionAttributes || {}, event.currentIntent.name, event.currentIntent.slots, 'Username', message));
}

/**
 * Call Chamberlain Backend Service API.
 * 
 * @param {*} event 
 * @param {*} callback 
 * @param {*} apiEndpoint 
 */
function dispatch(event, callback, apiEndpoint) {
  let intent = event.currentIntent.name;
  let options = {
      url: apiEndpoint,
      headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'authorization': CHAMBERLAIN_API_KEY,
          'dsi': CHAMBERLAIN_API_DSI
      }
  };
    
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {

      let info = JSON.parse(body);
      info.intent = intent;
      
      const message = {
        'contentType': 'CustomPayload',
        'content': JSON.stringify(info)
      }

      callback(null, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
      
    } else {
      console.log(error);
      callback(error);
    }    
  });
}

/**
 * Get student GPA from backend services. Login required.
 */
module.exports.gpa = (event, context, callback) => {
  try {
    let username = event.currentIntent.slots.Username.toUpperCase();

    if (!isDsiValid(username)) {
      rejectUsername(event, callback);
      return;
    }

    let apiEndpoint = CHAMBERLAIN_API_URL + 'api/gpa/dsi/' + username;

    dispatch(event, callback, apiEndpoint);
  } catch (err) {
      callback(err);
  }
};

/**
 * Get student account summary from backend services. Login required.
 */
module.exports.accountSummary = (event, context, callback) => {
  try {
    let username = event.currentIntent.slots.Username.toUpperCase();

    if (!isDsiValid(username)) {
      rejectUsername(event, callback);
      return;
    }

    let apiEndpoint = CHAMBERLAIN_API_URL + 'api/banner/accountsummary/dsi/' + username;

    dispatch(event, callback, apiEndpoint);
  } catch (err) {
      callback(err);
  }
};

module.exports.currentTermDate = (event, context, callback) => {
  try {
    let apiEndpoint = CHAMBERLAIN_API_URL + 'api/banner/termdetails';

    dispatch(event, callback, apiEndpoint);
  } catch (err) {
      callback(err);
  }
};