# Dialogflow custom integration

**by: Lee Boonstra, Developer Advocate Conversational AI, Google Cloud**

1. 'gcloud services enable dialogflow.googleapis.com'

1. 'gcloud init' to login and get the right permissions.

1. cd back-end

2. Install the required libraries, run the following command in this *examples* folder:

    `npm install`

3. Start the simpleserver node app:

   `npm --PORT=3000 --PROJECT_ID=[your-gcp-project-id] run start`

4. Browse to http://localhost:3000