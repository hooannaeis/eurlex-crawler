/**
 * scrapes a case data from eur-lex.europa.eu
 * scrape case-objects will have a meta and a body property
 * the meta-property gives insight into:
 * - references the case makes
 * - common tags that describe the case
 *
 * the body-property has a structured representation of the case text
 *
 * ORIGINS:
 * text of case: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62022TN0776&qid=1676118400438
 * meta-information of case: https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62022TN0776&qid=1676118400438
 *
 *
 */

(async function () {
    const {
        getCelexIDSFromPageAndYear,
        getTotalNumberOfSearchPages,
    } = require('./utils/celexIDs')
    const { getDocumentMeta } = require('./utils/caseMeta')
    const { getParsedBody } = require('./utils/caseBody')
    const { writeFileSync, readFileSync } = require('fs')
    const FILE_PATH = 'eurlexdata.json'

    const maxYear = new Date().getFullYear()
    let currentYear = 2022 // in production change this to the first year of data (e. g. 2010)
    let currentPage = 1
    const maxPages = await getTotalNumberOfSearchPages(currentPage, currentYear)
    for (currentYear; currentYear <= maxYear; currentYear += 1) {
        console.log(`currentYear: ${currentYear} of ${maxYear}`)
        for (currentPage; currentPage <= maxPages; currentPage += 1) {
            console.log(`page: ${currentPage}/${maxPages}`)
            const celexIDs = await getCelexIDSFromPageAndYear(
                currentPage,
                currentYear
            )
            const eurLexData = {}
            if (celexIDs.length) {
                for (let i = 0; i < celexIDs.length; i++) {
                    const celexID = celexIDs[i]
                    const caseMeta = await getDocumentMeta(celexID)
                    const caseBody = await getParsedBody(celexID)
                    eurLexData[celexID] = {
                        caseMeta,
                        caseBody,
                    }
                }
            }
            let prevEurlexDataJson = {}
            try {
                const prevEurlexData = await readFileSync(FILE_PATH)
                prevEurlexDataJson = JSON.parse(prevEurlexData)
            } catch (e) {
                console.error(e)
            }

            const newMetas = { ...prevEurlexDataJson, ...eurLexData }
            writeFileSync(FILE_PATH, JSON.stringify(newMetas))
        }
    }
})()
