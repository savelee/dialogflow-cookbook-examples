const projectId = process.env.npm_config_PROJECT_ID;
const port = ( process.env.npm_config_PORT || 3000 );
const languageCode = (process.env.npm_config_LANGUAGE || 'en-US');

// load all the libraries for the server
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const express = require('express');
const path = require('path');

// load all the libraries for the Dialogflow part
const uuid = require('uuid');
const df = require('dialogflow').v2beta1;

// create an express app
const app = express();

// setup Express
app.use(cors());
app.use(express.static(__dirname + '/../ui/'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../ui/index.html'));
});
server = http.createServer(app);
io = socketIo(server);
server.listen(port, () => {
    console.log('Running server on port %s', port);
});

 // Listener, once the client connect to the server socket
 io.on('connect', (client) => {
    console.log(`Client connected [id=${client.id}]`);
    client.emit('server_setup', `Server connected [id=${client.id}]`);

    // when the client sends 'message' events
    client.on('message', async function(msg) {
        //console.log(msg);
        const results = await detectIntent(msg);
        console.log(results);
        client.emit('returnResults', results);
    });
});

/**
 * Setup Dialogflow Integration
 */
function setupDialogflow(){
    // Dialogflow will need a session Id
    sessionId = uuid.v4();
    // Dialogflow will need a DF Session Client
    // So each DF session is unique
    sessionClient = new df.SessionsClient();
    // Create a session path from the Session client, 
    // which is a combination of the projectId and sessionId.
    sessionPath = sessionClient.sessionPath(projectId, sessionId);

    request = {
      session: sessionPath,
      queryInput: {
        text: {
            languageCode: languageCode
        }
      }
    }
}

 /*
  * Dialogflow Detect Intent based on Text
  * @param text - string
  * @return response promise
  */
 async function detectIntent(text){
    request.queryInput.text.text = text;
    console.log(request);
    const responses = await sessionClient.detectIntent(request);
    return responses;
 }

 setupDialogflow();