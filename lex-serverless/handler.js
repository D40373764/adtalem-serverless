'use strict';

/**
 * Respone to get required slot.
 * https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
 * 
 * @param {*} sessionAttributes 
 * @param {*} intentName 
 * @param {*} slots 
 * @param {*} slotToElicit 
 * @param {*} message 
 */
module.exports.elicitSlot = (sessionAttributes = {}, intentName, slots, slotToElicit, message) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName: intentName,
      slots: slots,
      slotToElicit: slotToElicit,
      message
    }
  };
}

/**
 * Directs Amazon Lex to choose the next course of action based on the bot configuration.
 * 
 * @param {*} sessionAttributes 
 * @param {*} slots 
 */
module.exports.delegate = (sessionAttributes = {}, slots) => {
  return {
      sessionAttributes,
      dialogAction: { type: 'Delegate', slots, }
  };
}

 /**
  * Switch intent.
  */
module.exports.switchIntent = (sessionAttributes = {}, slots, intentName, message) => {
  return {
      sessionAttributes,
      dialogAction: {
          type: 'ConfirmIntent',
          intentName: intentName,
          slots: slots,
          message: {
            contentType: 'PlainText',
            content: message
          },
      }
  };
}

/**
 * Finished intent.
 * 
 * @param {*} sessionAttributes 
 * @param {*} fulfillmentState 
 * @param {*} message 
 */
module.exports.close = (sessionAttributes = {}, fulfillmentState, message) => {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      fulfillmentState,
      message,
    }
  };
}