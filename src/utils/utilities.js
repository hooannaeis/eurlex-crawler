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

function getRegexMatchesFromString(input, regex) {
    try {

        const matches = input.match(regex)
        if (matches) return matches
        return undefined
    } catch (e) {
        return undefined
    }
}

function getListTextsBySelector(caseHtml, selector) {
    try {

        const listItems = []
        const itemNodes = caseHtml.querySelectorAll(selector)
        if (itemNodes && itemNodes.length) {
            itemNodes.forEach(itemNode => {
                const cleanItemNode = cleanseString(itemNode.innerText.trim())
                listItems.push(cleanItemNode)
            })
        }
        return listItems
    } catch (e) {
        return []
    }
}

function cleanseString(str) {
    return str.replace(/\s\s+/g, ' ')
}

module.exports = {getParsedHtml, getRegexMatchesFromString, getListTextsBySelector}