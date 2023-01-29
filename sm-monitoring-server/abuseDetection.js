// .env file contents
require('dotenv').config();
// Dependencies
const axios = require('axios')

// Predict if tweet text is abusive
module.exports.predictAbuseiveText = async function (textToAnalyze) {
    url = `${process.env.EMPATHLY_ENDPOINT}/predictHate`;
    try {
        var postData = {
            query: textToAnalyze,
        };
        let axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': `${process.env.FLASK_ENDPOINT}/predictHate`
            },
        };
        const response = await axios.post(url, postData, axiosConfig)
        const prediction = response.data["prediction"][0] ?? "acceptable";
        const confidence = response.data["confidence"][0] ?? 0;  
        return [prediction, confidence];
    } catch (error) {
        console.log("Abuse Detection Function:", error.message);
        return ["None", 0]
    }
}