const { getParsedHtml, getRegexMatchesFromString, getListTextsBySelector } = require("./utilities")


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
        authentic_language: undefined,
        references: {
            raw: [],
            tokenized: []
        } // 
    }
}

function getCaseTitle(caseHtml) {
    try {
        const TITLE_ID = "#title"
        const titleNode = caseHtml.querySelector(TITLE_ID)
        if (titleNode && titleNode.innerText) {
            return titleNode.innerText.trim()
        }
    } catch (e) {
        return "default title"
    }
}

function getCaseType(caseHtml) {
    try {

        const typeNode = caseHtml.querySelector("#PPMisc_Contents")
        if (typeNode && typeNode.innerText) {
            const typeText = typeNode.innerText.trim()
            const matches = [...typeText.matchAll(/Form:[\n\r\s]*(\w+)/gi)]
            if (matches[0] && matches[0][1]) {
                return matches[0][1]
            }
        }
    } catch (e) {
        return "default caseType"
    }
}

function getCaseDate(caseHtml) {
    try {
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
    } catch (e) {
        return "default title"
    }
}

/**
 * 
 * @param {Object} caseHtml parsed case HTML as provisioned by axios
 * @returns [Array] of strings
 */
function getCaseTags(caseHtml) {
    try {
        const TAG_SELECTOR = "#PPClass_Contents li"
        const tags = getListTextsBySelector(caseHtml, TAG_SELECTOR)
        return tags
    } catch (e) {
        return []
    }
}

/**
 * 
 * @param {Object} caseHtml parsed case HTML as provisioned by axios
 * @returns [Array] of strings
 */
function getRawDocumentReferences(caseHtml) {
    try {

        const TAG_SELECTOR = "#PPLinked_Contents li"
        const tags = getListTextsBySelector(caseHtml, TAG_SELECTOR)
        return tags
    } catch (e) {
        return []
    }
}

/**
 * 
 * @param {Object} caseHtml parsed case HTML as provisioned by axios
 * @returns [Array] of strings
 */
function getTokenizedReferences(rawReferences) {
    try {

        if (!rawReferences || !rawReferences.length || !rawReferences.push) { return [] }
        const tokenizedReferences = []
        rawReferences.forEach(ref => {
            const celexID = getCelexIDFromString(ref)
            const docSpecifiers = getDocumentSpecifierFromReference(ref)
            tokenizedReferences.push([...celexID, ...docSpecifiers])
        })
        return tokenizedReferences
    } catch (e) {
        return []
    }
}

function getDocumentSpecifierFromReference(input) {
    try {
        // matches a word  followed by a numberr. E. g. "paragraph 12" or "article 1"
        const specifierRegex = /\b\w+\s\d{1,4}\b/g
        const specifiers = getRegexMatchesFromString(input, specifierRegex)
        if (specifiers && specifiers.length) return specifiers
        return []
    } catch (e) {
        return []
    }
}


function getCelexIDFromString(input) {
    try {
        // based on https://eur-lex.europa.eu/content/help/eurlex-content/celex-number.html
        const celexRegex = /[\d|E|C][12]\d{3}[a-zA-Z]{1,2}\d{1,4}/g
        const celexID = getRegexMatchesFromString(input, celexRegex)
        if (celexID && celexID.length) return celexID
        return []
    } catch (e) {
        return []
    }
}

module.exports = { getDocumentMeta, getCelexIDFromString, getDocumentSpecifierFromReference, getTokenizedReferences }