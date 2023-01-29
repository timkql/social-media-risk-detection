// Dependencies
const express = require('express');
const routes = require('./routes/routes');
const utils = require('./utils');
const bodyParser = require('body-parser')
const cors = require('cors');

// Configuring Server
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const PORT = 3001;

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Worker Server running, listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);

var amqp = require('amqplib/callback_api');
const readNotificationRabbitMQ = async () => {
    setTimeout(() => {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
                var up = error0
                throw up; // haha
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

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, function(msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    // Sending notifications to all subscribed clients
                    const parsedData = JSON.parse(msg.content);
                    console.log(parsedData)
                }, {
                    noAck: true
                });
            });
        })
    })  
}
readNotificationRabbitMQ();

// utils.delTwitterRule("bullpig")

// Routes 
app.use('/api', routes)