// Dependencies
const axios = require('axios')

// Request Social Media Monitoring Server to add a rule to Twitter stream
module.exports.addTwitterRule = async function (value, tag) {
    url = 'http://localhost:3000/api/addTwitterRule';
    try {
        var postData = {
            value,
            tag
        };
        let axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000/api/addTwitterRule'
            },
        };
        const response = await axios.post(url, postData, axiosConfig)
        console.log(`Sent request to add ${value} rule to Twitter stream`)
        return response;
    } catch (error) {
        console.log(`Failed to send request to add ${value} rule to Twitter stream:`, error.message);
    }
}

// Request Social Media Monitoring Server to delete a rule from Twitter stream
module.exports.delTwitterRule = async function (value) {
    url = 'http://localhost:3000/api/delTwitterRule';
    try {
        var postData = {
            value
        };
        let axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000/api/delTwitterRule'
            },
        };
        const response = await axios.post(url, postData, axiosConfig)
        console.log(`Sent request to delete ${value} rule from Twitter stream`)
        return response;
    } catch (error) {
        console.log(`Failed to send request to delete ${value} rule from Twitter stream:`, error.message);
    }
}

module.exports.getTweetData = async function (tag) {
    const url = `http://localhost:3002/api/getTweetsByTag/${tag}`;
    try {
        let axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': url
            },
        };
        const response = await axios.get(url, axiosConfig)
        return response.data;
    } catch (error) {
        console.log("Get Tweet Data Function:", error.message);
    }
}