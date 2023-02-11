const getParsedHtml = require("./getParsedHtml")

async function getCaseIDs() {
    const CASE_OVERVIEW_URL = "https://eur-lex.europa.eu/search.html?DTA=2022&DTS_SUBDOM=EU_CASE_LAW&DTS_DOM=EU_LAW&CASE_LAW_SUMMARY=false&type=advanced&qid=1676124965168&page=1"
    const parsedHtml = await getParsedHtml(CASE_OVERVIEW_URL)
    const linkNodes = parsedHtml.querySelectorAll(".title")
    const caseIDs = []
    if (linkNodes && linkNodes.length) {
        linkNodes.forEach(linkNode => {
            if (linkNode.attrs && linkNode.attrs.href) {
                const caseID = getCaseIDfromURL(linkNode.attrs.href)
                caseIDs.push(caseID)
            }
        })
    }
    return caseIDs
}

function getCaseIDfromURL(url) {
    if (!url) return
    const matches = [...url.matchAll(/CELEX:(\w+)/gi)]
    if (matches[0] && matches[0][1]) {
        return matches[0][1]
    }
    return
}

module.exports = getCaseIDs