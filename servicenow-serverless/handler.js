'use strict';

const request = require('request');
const lex = require('lex-serverless');
require('custom-env').env('dev')

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const AUTH_CODE = "Basic " + new Buffer(username + ":" + password).toString("base64");

const INCIDENT_BY_DSI_URL = process.env.INCIDENT_BY_DSI_URL;
const WORK_NOTES_URL = process.env.IncidentWorkNotes;
const INCIDENT_DETAILS_URL = process.env.INCIDENT_DETAILS_URL;

const REQUEST_BY_DSI_URL = process.env.REQUEST_BY_DSI_URL;
const REQUEST_DETAIL_URL = process.env.REQUEST_DETAIL_URL;

const RITM_BY_DSI_URL = process.env.RITM_BY_DSI_URL;
const RITM_BY_NUMBER_URL = process.env.RITM_BY_NUMBER_URL;

const CALL_BY_DSI_URL = process.env.CALL_BY_DSI_URL;
const CALL_BY_NUMBER_URL = process.env.CALL_BY_NUMBER_URL;

function dispatch(apiEndpoint) {

  const options = {
    url: apiEndpoint,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': AUTH_CODE
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {

      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        console.log('error:');
        console.log(JSON.stringify(error || response));
        reject(error || response);
      }

    });
  });
};

function buildCustomBody(responseBody) {
  let result = JSON.parse(responseBody).result;
  let data = result.map(e => ({
    'number': e.number,
    'short_description': e.short_description,
    'sys_created_on': e.sys_created_on,
    'sys_updated_on': e.sys_updated_on,
    'sys_updated_by': e.sys_updated_by,
    'sys_id': e.sys_id,
    'stage': e.stage
  }));

  return {
    contentType: 'CustomPayload',
    content: JSON.stringify({"result": data})
  };
}

module.exports.getWorkNotes = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const sysId = event.currentIntent.slots.Sys_Id;
    const apiEndpoint = WORK_NOTES_URL + sysId;
    const incidentsBody = await dispatch(apiEndpoint);
    
    message.contentType = 'CustomPayload';
    message.content = incidentsBody
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getIncidentByNumber = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const number = event.currentIntent.slots.Incident_Number;
    const apiEndpoint = INCIDENT_DETAILS_URL + number;
    const incidentsBody = await dispatch(apiEndpoint);
    
    message.contentType = 'CustomPayload';
    message.content = incidentsBody
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getIncidentsByDsi = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const username = event.currentIntent.slots.Username.toUpperCase();
    const apiEndpoint = INCIDENT_BY_DSI_URL + username;
    const responseBody = await dispatch(apiEndpoint);    
    message = buildCustomBody(responseBody);
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getRequestsByDsi = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const username = event.currentIntent.slots.Username.toUpperCase();
    const apiEndpoint = REQUEST_BY_DSI_URL + username;
    const responseBody = await dispatch(apiEndpoint);
    message = buildCustomBody(responseBody);
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getRequestByNumber = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const number = event.currentIntent.slots.Request_Number;
    const apiEndpoint = REQUEST_DETAIL_URL + number;
    const responseBody = await dispatch(apiEndpoint);

    message.contentType = 'CustomPayload';
    message.content = responseBody;

  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getRitmsByDsi = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const username = event.currentIntent.slots.Username.toUpperCase();
    const apiEndpoint = RITM_BY_DSI_URL + username;
    const responseBody = await dispatch(apiEndpoint);
    message = buildCustomBody(responseBody);
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getRitmByNumber = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const number = event.currentIntent.slots.Ritm_Number;
    const apiEndpoint = RITM_BY_NUMBER_URL + number;
    const responseBody = await dispatch(apiEndpoint);
    message.contentType = 'CustomPayload';
    message.content = responseBody;
  } catch (exceptipn) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getCallsByDsi = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const username = event.currentIntent.slots.Username.toUpperCase();
    const apiEndpoint = CALL_BY_DSI_URL + username;
    const responseBody = await dispatch(apiEndpoint);
    message = buildCustomBody(responseBody);
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getCallByNumber = async (event, context, callback) => {
  let message = {};
  let error = null;
  console.log("**event");
  console.log(event);
  try {
    const number = event.currentIntent.slots.Call_Number;
    const apiEndpoint = CALL_BY_NUMBER_URL + number;
    const responseBody = await dispatch(apiEndpoint);
    message = buildCustomBody(responseBody);
  } catch (exception) {
    error = {
      contentType: 'PlainText',
      content: exception
    }
  }

  callback(error, lex.close(event.sessionAttributes || {}, 'Fulfilled', message));
};

module.exports.getMarkdown = async (event, context, callback) => {
  let message = {};
  try {
    message.contentType = 'SSML';
    message.content = "<speak>This is a markdown demo</speak>";
  } catch (error) {
    message.contentType = 'PlainText';
    message.content = error;
  }

  var sessionAttributes = {
    "appContext": "{\"altMessages\":{\"markdown\":\"Transcripts can be ordered by using the following link: [Request for transcripts](https://www.chamberlain.edu/academics/academic-resources/request-for-transcripts)\",\"ssml\":\"<speak>Follow the instructions on the page to request electronic and paper transcripts.</speak>\"}}"
  };

  callback(null, lex.close(
    sessionAttributes,
    'Fulfilled', 
    message));
};

/** 
 * Todo List
 */
module.exports.getSsml = (event, context, callback) => {
    
  var sessionAttributes = {};
  
  let message = {};
  message.contentType = 'SSML';
  message.content = '<speak>This is my SSML message</speak>';
        
  var data = {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState: 'Fulfilled',
      message
    }
  };

  callback(null, data);
}