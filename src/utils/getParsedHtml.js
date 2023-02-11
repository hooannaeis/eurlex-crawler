const axios = require('axios');
const { parse } = require('node-html-parser');

async function getParsedHtml(url) {
    try {
        const response = await axios.get(url)
        if (response.status < 300 && response.data) {
            const parsedHtml = parse(response.data)
            return parsedHtml
        }
        throw new Error(response)

    } catch (error) {
        console.log(error.response.body);
    }
}

module.exports = getParsedHtml