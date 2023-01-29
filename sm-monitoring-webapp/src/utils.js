import axios from 'axios'

const getTweetData = async (tag) => {
    const url = `http://localhost:3001/api/getTweetsByTag/${tag}`;
    try {
        let axiosConfig = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': `http://localhost:3001/api/getTweetsByTag/${tag}`
            },
        };
        const response = await axios.get(url, axiosConfig)
        return response.data;
    } catch (error) {
        console.log("Get Tweet Data Function:", error.message);
    }
}

export { getTweetData }