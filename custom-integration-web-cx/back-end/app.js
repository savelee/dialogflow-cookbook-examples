//1) These system variables can be set from the command-line with --PROJECT_ID, --PORT and --LANGUAGE
const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const agentId = process.env.AGENT_ID;

console.log(projectId, location, agentId);

const port = ( process.env.PORT || 8080 );
const languageCode = (process.env.LANGUAGE || 'en-US');

//2) Load all the libraries needed by this app
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');
// These are specific to Dialogflow
const uuid = require('uuid');

const df = require('@google-cloud/dialogflow').v3beta1;


//3) Create an express app
const app = express();

//4) Setup Express, and load the static files and HTML page
app.use(cors());
app.use(express.static(__dirname + '/ui/'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/ui/index.html'));
});

//5) Create the Server and listen to the PORT variable
server = http.createServer(app);
io = socketIo(server);
server.listen(port, () => {
    console.log('Running server on port %s', port);
});

//6 Socket.io listener, once the client connect to the server socket
// then execute this block.
io.on('connect', (client) => {
    console.log(`Client connected [id=${client.id}]`);
    client.emit('server_setup', `Server connected [id=${client.id}]`);


    // 7B When the client sends 'welcome' events
    // then execute this block
    client.on('welcome', async function() {
        const welcomeResults = await welcomeIntent(); //TODO ideally you want to solve this with events.
        client.emit('returnResults', welcomeResults);
    });

    //7) When the client sends 'message' events
    // then execute this block
    client.on('message', async function(msg) {
        //console.log(msg);

        //8) A promise to do intent matching
        const results = await detectIntent(msg);
        console.log(results); //NOTE: The results will be in queryResult.responseMessages

        //9) Return the Dialogflow after intent matching to the client UI.
        client.emit('returnResults', results);
    });
});

/**
 * Setup Dialogflow Integration
 */
function setupDialogflow(){
    //10) Dialogflow will need a session Id
    sessionId = uuid.v4();
    
    //11) Dialogflow will need a DF Session Client
    // So each DF session is unique
    sessionClient = new df.SessionsClient();
    
    //12) Create a session path from the Session client, 
    // which is a combination of the projectId and sessionId.
    sessionPath = `projects/${projectId}/locations/${location}/agents/${agentId}/sessions/${sessionId}`;

    //13) These objects are in the Dialogflow request
    request = {
      session: sessionPath,
      queryInput: {
        languageCode: languageCode //NOTE: This moved into the queryInput i.so. queryInput.text
      }
    }
}

 /*
  * Dialogflow Detect Intent based on Text
  * @param text - string
  * @return response promise
  */
 async function detectIntent(text){
    //14) Get the user utterance from the UI
    request.queryInput.text =  {
        text: text
    };
    console.log(request);
    
    //15) The Dialogflow SDK method for intent detection.
    // It returns a Promise, which will be resolved once the
    // fulfillment data comes in.
    const responses = await sessionClient.detectIntent(request);
    return responses;
 }


 /*
  * Dialogflow Detect Intent based on an Event
  * @param eventName - string
  * @return response promise
  */
 //16 
 async function welcomeIntent(){
    request.queryInput.text =  {
        text: 'hi'
    };
    console.log(request);
    const responses = await sessionClient.detectIntent(request);
    console.log(responses);
    return responses;
 }

 //Run this code.
 setupDialogflow();