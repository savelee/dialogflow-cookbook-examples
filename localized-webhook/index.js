'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient, Card, Suggestion } = require('dialogflow-fulfillment');

//1
const i18n = require('i18n');
const moment = require('moment');
const numeral = require('numeral');

//2
i18n.configure({
  locales: ['en-US', 'nl-NL'],
  directory: __dirname + '/locales',
  defaultLocale: 'en-US'
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 

  //3
  //i18n.setLocale(conv.user.locale);
  //moment.locale(conv.user.locale);

  function welcome(agent) {
    agent.add(i18n.__('WELCOME_BASIC'));
  }
 
  function fallback(agent) {
    agent.add(i18n.__('FALLBACK_BASIC'));
  }

  function getPrice(agent) {
    agent.add(i18n.__('PRICE'));
  }

  function getDeliveryDate(agent) {
    agent.add(i18n.__('DELIVERY_DATE', moment().format('LL')));
  }

  function getTotalNumber(agent) {
    agent.add(i18n.__('TOTAL NUMBER', numeral(1000).format('0,0')));
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);

  intentMap.set('Get_Price', getPrice);
  intentMap.set('Get_Delivery_Date', getDeliveryDate);
  intentMap.set('Get_Total_Number', getTotalNumber);

  agent.handleRequest(intentMap);
});