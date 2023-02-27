const { getParsedHtml } = require('./utilities')

/**
 * parses all celex-IDs from the search results of the serach page for the given page/year
 */
async function getCelexIDSFromPageAndYear(currentPage, currentYear) {
    let documentOverviewURL = getDocumentOverviewURL(currentPage, currentYear)
    const parsedHtml = await getParsedHtml(documentOverviewURL)
    const celexIDs = getCelexIDsFromHtml(parsedHtml)
    return celexIDs
}

/**
 * generates the URL for a given page/year on which cases can be found
 */
function getDocumentOverviewURL(currentPage, currentYear) {
    if (!currentPage) {
        throw new Error('missing currentPage')
    }
    if (!currentYear) {
        throw new Error('missing currentYear')
    }
    return `https://eur-lex.europa.eu/search.html?DTA=${currentYear}&DTS_SUBDOM=EU_CASE_LAW&DTS_DOM=EU_LAW&CASE_LAW_SUMMARY=false&type=advanced&qid=1676124965168&page=${currentPage}`
}

/**
 * parses the celex IDs from an html object
 */
async function getCelexIDsFromHtml(parsedHtml) {
    const linkNodes = parsedHtml.querySelectorAll('.title')
    const celexIDs = []
    if (linkNodes && linkNodes.length) {
        linkNodes.forEach((linkNode) => {
            if (linkNode.attrs && linkNode.attrs.href) {
                const celexID = getCelexIDfromHref(linkNode.attrs.href)
                celexIDs.push(celexID)
            }
        })
    }
    return celexIDs
}

/**
 *
 * @param {String} url parses the eur-lex celex ID from a given URL string
 * @returns celexID
 */
function getCelexIDfromHref(url) {
    if (!url) return
    const matches = [...url.matchAll(/CELEX:(\w+)/gi)]
    if (matches[0] && matches[0][1]) {
        return matches[0][1]
    }
    return
}

/**
 *
 * @param {Number} currentPage current search result page
 * @param {String} currentYear the year for which to get the search results
 * @returns
 */
async function getTotalNumberOfSearchPages(currentPage, currentYear) {
    let documentOverviewURL = getDocumentOverviewURL(currentPage, currentYear)
    const parsedHtml = await getParsedHtml(documentOverviewURL)
    const lastPageButton = parsedHtml.querySelector("[title='Last Page']")
    if (!lastPageButton || !lastPageButton.attrs.href) {
        console.log('no lastpagebutton url')
        return 1
    }
    const lastPageButtonHref = lastPageButton.attrs.href
    const lastPageSearchParams = new URLSearchParams(lastPageButtonHref)
    const totalPageCount = lastPageSearchParams.get('page')

    if (!lastPageSearchParams && !totalPageCount) {
        console.log('no lastpagebutton page-param')
        return 1
    }

    if (!Boolean(Number(totalPageCount))) {
        console.log(totalPageCount, ' not a number')
        return 1
    }
    return Number(totalPageCount)
}

module.exports = { getCelexIDSFromPageAndYear, getTotalNumberOfSearchPages }
