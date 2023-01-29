// Dependencies
const TweetModel = require('./models/tweetModel');
const UserModel = require('./models/userModel');
const amqp = require('amqplib/callback_api');

// Add user data to DB
module.exports.addUserToDb = async function (id, firstName, lastName, email, usernames) {
    const user = new UserModel({
        id,
        firstName,
        lastName,
        email,
        usernames
    })
    try {
        const userToSave = await user.save();
        console.log(`Response 200: ${userToSave} successfully added to tokenDB`)
    }
    catch (error) {
        console.log(error.message)
    }
}

// Add user data to DB
module.exports.addTweetToDb = async function (id, text, tag, image, label) {
    const user = new TweetModel({
        id,
        text,
        tag,
        image,
        URL: `https://twitter.com/anyuser/status/${id}`,
        label
    })
    try {
        const userToSave = await user.save();
        console.log(`Response 200: ${userToSave} successfully added to tokenDB`)
    }
    catch (error) {
        console.log("Failed to add tweet to DB: ", error.message)
    }
}

// Add a rule to twitter stream
module.exports.addTwitterStreamRules = async function (client, valueTags) {
    try {
        const addedRules = await client.v2.updateStreamRules({
            add: valueTags,
        });
        console.log(valueTags, "rule(s) successfully added to Twitter stream")
        return addedRules
    }
    catch (error) {
        console.log("Failed to add rule to Twitter Stream: ", error.message)
    }
}

// Delete a rule to twitter stream
module.exports.delTwitterStreamRules = async function (client, values) {
    try {
        const deleteRules = await client.v2.updateStreamRules({
            delete: {
                values
            },
        });
        console.log(`${values} rule(s) successfully deleted from Twitter stream`)
        return deleteRules;
    }
    catch (error) {
        console.log("Failed to delete rule to Twitter Stream: ", error.message)
    }
}

// Send notification to worker-server
module.exports.notifyWorker = async function (matching_rules) {
    
    notificationData = {
        rules: matching_rules
    }
    
    try {
        amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'notification-indiv';

            channel.assertQueue(queue, {
                maxPriority: 10,
                durable: false
            });

            var msg = JSON.stringify(notificationData);

            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [notification-indiv] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
        
    }
    catch (error) {
        console.log('error:', error.message)
        res.status(400).json({message: error.message})
    }

}

