# Dialogflow custom integration

**by: Lee Boonstra, Developer Advocate Conversational AI, Google Cloud**

1. https://cloud.google.com/docs/authentication/getting-started - get the service account.

1. `gcloud services enable dialogflow.googleapis.com`

1. `gcloud init` to login and get the right permissions.

1. `cd back-end`

1. Install the required libraries:

    `npm install`

1. Start the node app:

   `npm --PROJECT_ID=[your-gcp-project-id] --LOCATION=[your location id] --AGENT_ID=[your-gcp-agent-id] run start`

   `npm --PROJECT_ID=dialogflow-cx-demo-285510 --LOCATION=global --AGENT_ID=a4e8f92b-d85b-4259-906b-4debc163c856 run start`

1. Browse to http://localhost:3000
