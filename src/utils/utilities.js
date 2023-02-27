const axios = require('axios')
const { parse } = require('node-html-parser')

async function getParsedHtml(url) {
    try {
        const response = await axios.get(url)
        if (response.status < 300 && response.data) {
            const parsedHtml = parse(response.data)
            return parsedHtml
        }
        throw new Error(response)
    } catch (error) {
        if (error.response.statusText ) return console.log(error.response.statusText)
        console.log(error)
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


/**
 * 
 * @param {Object} caseHtml html object
 * @param {String} selector CSS elector
 * @param {Boolean} emphasizeNodeSpecialness if true, objects in the returned array will have an indication if their class is different to the previous node's
 * @returns Array
 */
function getListTextsBySelector(caseHtml, selector, emphasizeNodeSpecialness) {
    try {
        const listItems = []
        const itemNodes = caseHtml.querySelectorAll(selector)
        if (itemNodes && itemNodes.length) {
            let previousClassName;
            itemNodes.forEach((itemNode) => {
                const cleanItemNode = cleanseString(itemNode.innerText.trim())
                let nodetoPush = cleanItemNode
                if (emphasizeNodeSpecialness) {
                    nodetoPush = getObjectWithClassNameChange(itemNode, previousClassName)
                    previousClassName = itemNode.classNames
                }
                listItems.push(nodetoPush)
            })
        }
        return listItems
    } catch (e) {
        return []
    }
}

function getObjectWithClassNameChange(itemNode, previousClassName) {
    const thisClassNames = itemNode.classNames
    return {
        text: cleanseString(itemNode.innerText.trim()),
        classNameChange: thisClassNames !== previousClassName,
        isAnchor: Boolean(itemNode.id)
    }
}

function cleanseString(str) {
    return str.replace(/\s\s+/g, ' ')
}

module.exports = {
    getParsedHtml,
    getRegexMatchesFromString,
    getListTextsBySelector,
}
