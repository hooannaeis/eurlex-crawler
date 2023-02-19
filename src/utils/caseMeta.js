const getParsedHtml = require("./getParsedHtml")


/**
 * @param {String} celexID celex ID the uniquely identifies a document on eurlex (https://eur-lex.europa.eu/content/help/eurlex-content/celex-number.html#:~:text=A%20CELEX%20number%20is%20a,on%20the%20type%20of%20document.)
 * @returns meta data for document
 */
async function getDocumentMeta(celexID) {
    const caseMeta = getDocumentMetaSkelleton()
    caseMeta.id = celexID
    const CASE_META_URL = `https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=${encodeURIComponent('CELEX:' + celexID)}`
    const caseHtml = await getParsedHtml(CASE_META_URL)

    caseMeta.type = getCaseType(caseHtml)
    caseMeta.title = getCaseTitle(caseHtml)
    caseMeta.date = getCaseDate(caseHtml)
    caseMeta.tags = getCaseTags(caseHtml)
    caseMeta.references.raw = getRawDocumentReferences(caseHtml)
    caseMeta.references.tokenized = getTokenizedReferences(caseMeta.references.raw)
    return caseMeta
}

function getDocumentMetaSkelleton() {
    return {
        id: undefined, // identifier of doc on eur-lex.eu
        title: undefined, // human readable title of document
        tags: [], // selection of descriptive tags
        type: undefined, // document type, e.g. resolution, treaty, etc
        date: undefined,
        references: {
            raw: [],
            tokenized: []
        } // 
    }
}

function getCaseTitle(caseHtml) {
    const TITLE_ID = "#title"
    const titleNode = caseHtml.querySelector(TITLE_ID)
    if (titleNode && titleNode.innerText) {
        return titleNode.innerText.trim()
    }
    return "no title found"
}

function getCaseType(caseHtml) {
    const typeNode = caseHtml.querySelector("#PPMisc_Contents")
    if (typeNode && typeNode.innerText) {
        const typeText = typeNode.innerText.trim()
        const matches = [...typeText.matchAll(/Form:[\n\r\s]*(\w+)/gi)]
        if (matches[0] && matches[0][1]) {
            return matches[0][1]
        }
    }
    return
}

function getCaseDate(caseHtml) {
    const DATE_ID = "#PPDates_Contents"
    const dateNode = caseHtml.querySelector(DATE_ID)
    if (dateNode) {
        const dateNodeText = dateNode.innerText.trim()
        let matches = [...dateNodeText.matchAll(/Date of document:[\n\r\s]*(\d{1,2}\/\d{1,2}\/\d{4})/gmi)]
        if (matches[0] && matches[0][1]) {
            return matches[0][1]
        }
        matches = [...dateNodeText.matchAll(/Date of vote:[\n\r\s]*(\d{1,2}\/\d{1,2}\/\d{4})/gmi)]
        if (matches[0] && matches[0][1]) {
            return matches[0][1]
        }
        return
    }
}

function getCaseTags(caseHtml) {
    const TAG_SELECTOR = "#PPClass_Contents li"
    const tags = getListTextsBySelector(caseHtml, TAG_SELECTOR)
    return tags
}

function getRawDocumentReferences(caseHtml) {
    const TAG_SELECTOR = "#PPLinked_Contents li"
    const tags = getListTextsBySelector(caseHtml, TAG_SELECTOR)
    return tags
}

function getTokenizedReferences(rawReferences) {
    if (!rawReferences || !rawReferences.length || !rawReferences.push) { return [] }
    const tokenizedReferences = []
    rawReferences.forEach(ref => {
        const celexID = getCelexIDFromString(ref)
        const docSpecifiers = getDocumentSpecifierFromReference(ref)
        tokenizedReferences.push([...celexID, ...docSpecifiers])
    })
    return tokenizedReferences
}

function getDocumentSpecifierFromReference(input) {
    // matches a word  followed by a numberr. E. g. "paragraph 12" or "article 1"
    const specifierRegex = /\b\w+\s\d{1,4}\b/g
    const specifiers = getRegexMatchesFromString(input, specifierRegex)
    if (specifiers && specifiers.length) return specifiers
    return []
}


function getCelexIDFromString(input) {
    // based on https://eur-lex.europa.eu/content/help/eurlex-content/celex-number.html
    const celexRegex = /[\d|E|C][12]\d{3}[a-zA-Z]{1,2}\d{1,4}/g
    const celexID = getRegexMatchesFromString(input, celexRegex)
    if (celexID && celexID.length) return celexID
    return []
}

function getRegexMatchesFromString(input, regex) {
    const matches = input.match(regex)
    if (matches) return matches
    return undefined
}

function getListTextsBySelector(caseHtml, selector) {
    const listItems = []
    const itemNodes = caseHtml.querySelectorAll(selector)
    if (itemNodes && itemNodes.length) {
        itemNodes.forEach(itemNode => {
            const cleanItemNode = cleanseString(itemNode.innerText.trim())
            listItems.push(cleanItemNode)
        })
    }
    return listItems
}

function cleanseString(str) {
    return str.replace(/\s\s+/g, ' ').toLowerCase()
}

module.exports = { getDocumentMeta, getCelexIDFromString, getDocumentSpecifierFromReference, getTokenizedReferences }