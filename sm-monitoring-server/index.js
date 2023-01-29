// .env file contents
require('dotenv').config();

// Dependencies
const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const utils = require('./utils');
const abuseDetection = require("./abuseDetection");
const Twitter = require('twitter-api-v2')

const twitterClient = new Twitter.TwitterApi(process.env.BEARER_TOKEN);

// Tell js it's a readonly app
const readOnlyTwitterClient = twitterClient.readOnly

// Client Get function
module.exports.getTwitterClient = function() {
    return readOnlyTwitterClient
}

// Server Config
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const PORT = 3002;


// Connecting to MongoDB 
mongoString = process.env.DATABASE_URL
mongoose.set('strictQuery', false);
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Social Media Monitoring Server running, listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);


startTwitterStream = async function() {
    const rules = await readOnlyTwitterClient.v2.streamRules();

    const stream = await readOnlyTwitterClient.v2.searchStream();
    try{
        console.log("Current Rules:", rules.data.map(rule => rule.value));
    } catch(error){
        console.log("No Rules Set")
    }
    

    // Awaits for a tweet
    stream.on(
    // Emitted when Node.js {response} emits a 'error' event (contains its payload).
        Twitter.ETwitterStreamEvent.ConnectionError,
        err => console.log('Connection error!', err),
    );
    
    stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        Twitter.ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.'),
    );
    
    stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        Twitter.ETwitterStreamEvent.Data,
        async eventData => {
            console.log('Twitter has sent something:', eventData);
            // Check caption for abuse
            var label = [];
            label = await abuseDetection.predictAbuseiveText(eventData.data.text);
            if(typeof label[0] != 'undefined' && label[0] != 'acceptable' && label[1] >= 0.90){
                const parsedRules = eventData.matching_rules[0];
                await utils.addTweetToDb(eventData.data.id, eventData.data.text, parsedRules.tag, "none", label[0]);
                await utils.notifyWorker(eventData.matching_rules);
            }
        }
    );
    
    stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        Twitter.ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
    );
    
    // Enable reconnect feature
    stream.autoReconnect = true;
    
    // Be sure to close the stream where you don't want to consume data anymore from it
    // stream.close();
}
startTwitterStream();

// utils.notifyWorker("timothyliaukq@gmail.com")

// Routes 
app.use('/api', routes)

// utils.addUserToDb(0, "Timothy", "Liau", "timothyliaukq@gmail.com", ["tim.liau", "bullpig", "timothyliau"])

