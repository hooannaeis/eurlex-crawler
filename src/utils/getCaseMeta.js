const getParsedHtml = require("./getParsedHtml")

async function getCaseMeta(caseID) {
    const caseMeta = getCaseMetaSkelleton()
    caseMeta.id = caseID
    const CASE_META_URL = `https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=${encodeURIComponent('CELEX:' + caseID)}`
    const caseHtml = await getParsedHtml(CASE_META_URL)

    caseMeta.type = getCaseType(caseHtml)
    caseMeta.title = getCaseTitle(caseHtml)
    caseMeta.date = getCaseDate(caseHtml)
    caseMeta.tags = getCaseTags(caseHtml)
    caseMeta.references = getCaseReferences(caseHtml)
    return caseMeta
}

function getCaseMetaSkelleton() {
    return {
        id: undefined, // identifier of doc on eur-lex.eu
        title: undefined, // human readable title of document
        tags: [], // selection of descriptive tags
        type: undefined, // document type, e.g. resolution, treaty, etc
        date: undefined,
        references: [] // 
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
        let matches = [...dateNodeText.matchAll(/Date of vote:[\n\r\s]*(\d{1,2}\/\d{1,2}\/\d{4})/gmi)]
        if (matches[0] && matches[0][1]) {
            return matches[0][1]
        }
        matches = [...dateNodeText.matchAll(/Date of document:[\n\r\s]*(\d{1,2}\/\d{1,2}\/\d{4})/gmi)]
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

function getCaseReferences(caseHtml) {
    const TAG_SELECTOR = "#PPLinked_Contents li"
    const tags = getListTextsBySelector(caseHtml, TAG_SELECTOR)
    return tags
}

function getListTextsBySelector(caseHtml, selector) {
    const listItems = []
    const itemNodes = caseHtml.querySelectorAll(selector)
    if (itemNodes && itemNodes.length) {
        itemNodes.forEach(itemNode => {
            listItems.push(itemNode.innerText.trim())
        })
    }
    return listItems
}

module.exports = getCaseMeta