# Dialogflow CX custom integration

**by: Lee Boonstra, Developer Advocate Conversational AI, Google Cloud**

1. Import the Demo Agent, by creating a new CX agent, and import the cx-demo.json file (from the agent create screen)

1. https://cloud.google.com/docs/authentication/getting-started - get the service account.

1. `gcloud services enable dialogflow.googleapis.com`

1. `gcloud init` to login and get the right permissions.

1. `cd back-end`

1. Install the required libraries:

    `npm install`

1. Start the node app:

   `npm --PROJECT_ID=[your-gcp-project-id] --LOCATION=[your location] --AGENT_ID=[your-gcp-agent-id] run start`

   *You can see which values you will need to fill in, by looking into the URL bar of the Dialogflow CX console. Or clicking on the Agents Dropdown > View all agents.*

   `npm --PROJECT_ID=chatbotportal-v3 --LOCATION=global --AGENT_ID=a4e8f92b-d85b-4259-906b-4debc163c856 run start`

1. Browse to http://localhost:3000

1. start with: "Hi" and then "Which conversational tool should I use?"
