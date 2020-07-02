const { BigQuery } = require('@google-cloud/bigquery');
const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub({
    projectId: process.env.npm_config_PROJECT_ID
});

const bigquery = new BigQuery({
    projectId: process.env.npm_config_PROJECT_ID
});

const id = process.env.npm_config_PROJECT_ID;
const dataLocation = 'US';
const datasetChatMessages = 'chatanalytics';
const tableChatMessages = 'chatmessages';
const topicChatbotMessages = 'chatbotanalytics';

// tslint:disable-next-line:no-suspicious-comment
const schemaChatMessages = "BOT_NAME,TEXT,POSTED:TIMESTAMP,SCORE:FLOAT,MAGNITUDE:FLOAT,INTENT_RESPONSE,INTENT_NAME,CONFIDENCE:FLOAT,IS_FALLBACK:BOOLEAN,IS_END_INTERACTION:BOOLEAN,PLATFORM,SESSION";

/**
 * Analytics class to store chatbot analytics in BigQuery. 
 */
class Analytics {

    constructor() {
        this.setupBigQuery(datasetChatMessages, 
            tableChatMessages, dataLocation, schemaChatMessages);

        this.setupPubSub(topicChatbotMessages);
    }

    /**
     * If dataset doesn't exist, create one.
     * If table doesn't exist, create one.
     * @param {string} bqDataSetName BQ Dataset name
     * @param {string} bqTableName BQ Table name 
     * @param {string} bqLocation BQ Data Location
     * @param {string} schema BQ table schema  
     */
    setupBigQuery(bqDataSetName, bqTableName, bqLocation, schema) {
        const dataset = bigquery.dataset(bqDataSetName);
        const table = dataset.table(bqTableName);

        dataset.exists(function(err, exists) {
            if (err) console.error('ERROR', err);
            if (!exists) {
                    dataset.create({
                    id: bqDataSetName,
                    location: bqLocation
                }).then(function() {
                    console.log("dataset created");
                    // If the table doesn't exist, let's create it.
                    // Note the schema that we will pass in.
                    table.exists(function(err, exists) {
                        if (!exists) {
                            table.create({
                                id: bqTableName,
                                schema: schema
                            }).then(function() {
                                console.log("table created");
                            });
                        } else {
                            console.error('ERROR', err);
                        }
                    });
                });
            }
        });


        table.exists(function(err, exists) {
            if (err) console.error('ERROR', err);
            if (!exists) {
                table.create({
                    id: bqTableName,
                    schema: schema
                }).then(function() {
                    console.log("table created");
                });
            }
        });
    }

    /**
     * If topic is not created yet, please create.
     * @param {string} topicName PubSub Topic Name
     */
    setupPubSub(topicName) {
        const topic = pubsub.topic(`projects/${id}/topics/${topicName}`);
        topic.exists((err, exists) => {
            if (err) console.error('ERROR', err);
            if (!exists) {
                pubsub.createTopic(topicName).then(results => {
                    console.log(results);
                    console.log(`Topic ${topicName} created.`);
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
            }
        });
    }

    /**
     * Execute Query in BigQuery
     * @param {string} sql SQL Query
     * @return {Promise<bigQueryRow>}
     */
    queryBQ(sql) {
        return new Promise(function(resolve, reject) {
            if (sql) {
                bigquery.query(sql).then(function(data) {
                    resolve(data);
                });
            } else {
                reject("ERROR: Missing SQL");
            }
        });
    }

    /**
     * Add Item to BigQuery
     * @param {string} bqDataSetName - the name of the choosen dataset
     * @param {string} bqTableName - the name of the choosen dataset
     * @param {bigQueryRow} row - The Object to insert based on schema
     * @return {Promise<void>}
     */
    async insertInBQ(bqDataSetName, bqTableName, row) {
        const dataset = bigquery.dataset(bqDataSetName);
        const table = dataset.table(bqTableName);
        return table.insert(row);
    }

    /**
     * Push to PubSub Channel
     * @param {object} json JSON Object
     * @param {string} topicName unformed Pub/Sub topic name
     * @return {Promise<any>}
     */
    async pushToChannel(json, topicName) {
        const topic = pubsub.topic(`projects/${id}/topics/${topicChatbotMessages}`);
        let dataBuffer = Buffer.from(JSON.stringify(json), 'utf-8');
        try {
            const messageId = await topic.publish(dataBuffer);
            console.log(`Message ${messageId} published to topic: ${topicChatbotMessages}`);
        } catch(error) {
            console.log(error)
        }
    }
}

module.exports = analytics = new Analytics();