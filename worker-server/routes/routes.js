// Dependencies
const express = require('express');
const utils = require('../utils')
const router = express.Router()
module.exports = router;

router.post('/addTwitterRule', async (req, res, next) => {
    try{
        ruleData = req.body;
        utils.addTwitterRule(index.getTwitterClient(), [{value: ruleData.value, tag: ruleData.tag}]);
        res.json(ruleData);
    } catch (error){
        console.log(error.message);
    }
})

router.post('/delTwitterRule', async (req, res, next) => {
    try{
        ruleData = req.body;
        utils.delTwitterRule(index.getTwitterClient(), [ruleData.value]);
        res.json(ruleData);
    } catch (error){
        console.log(error.message);
    }
})

router.get('/getTweetsByTag/:tag', async (req, res, next) => {
    const tag = req.params.tag;
    try{
        const tweetData = await utils.getTweetData(tag);
        res.json(tweetData);
    } catch (error){
        console.log(error.message);
    }
})
