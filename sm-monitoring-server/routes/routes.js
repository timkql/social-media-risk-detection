// Dependencies
const index = require('../index')
const utils = require('../utils')
const TweetModel = require('../models/tweetModel');
const express = require('express');
const router = express.Router()
module.exports = router;

// Add a rule to Twitter stream
router.post('/addTwitterRule', async (req, res, next) => {
    try{
        ruleData = req.body; 
        utils.addTwitterStreamRules(index.getTwitterClient(), [{value: ruleData.value, tag: ruleData.tag}]);
        res.json(ruleData);
    } catch (error){
        console.log(error.message);
    }
})

// Delete a rule from Twitter stream
router.post('/delTwitterRule', async (req, res, next) => {
    try{
        ruleData = req.body;
        utils.delTwitterStreamRules(index.getTwitterClient(), [ruleData.value]);
        res.json(ruleData);
    } catch (error){
        console.log(error.message);
    }
})

router.get('/getTwitterRules', async (req, res, next) => {
    try{
        const rules = await index.getTwitterClient().v2.streamRules();
        res.json(rules.data.map(rule => rule.value))
    } catch(error){
        console.log(error.message)
    }
})

// Get by ID Method
router.get('/getTweetsByTag/:tag', async (req, res) => {
    const tag = req.params.tag;
    try{
        const data = await TweetModel.find({tag: tag});
        res.json(data)
        console.log(`Tweet data for Tag: ${tag} requested`)
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})
