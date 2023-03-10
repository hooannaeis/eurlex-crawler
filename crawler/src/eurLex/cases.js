const {
    getCelexIDSFromPageAndYear,
    getTotalNumberOfCaseSearchPages,
} = require('./getCelexIDs')
const { getDocumentMeta } = require('./documentMeta')
const { getParsedBody } = require('./documentBody')
const { writeFileSync, readFileSync } = require('fs')

async function getAllCases(inputMinYear, inputMaxYear) {
    console.log("GETTING CASES")
    console.log("-------------")

    const maxYear = inputMaxYear || new Date().getFullYear()
    for (let currentYear = inputMinYear || 2015; currentYear <= maxYear; currentYear += 1) {
        let FILE_PATH = `./data/cases-${currentYear}.json`
        console.log(`currentYear: ${currentYear} of ${maxYear}`)
        const maxPages = await getTotalNumberOfCaseSearchPages(1, currentYear)

        for (let currentPage = 1; currentPage <= maxPages; currentPage += 1) {
            console.log(`page: ${currentPage}/${maxPages}`)
            const celexIDs = await getCelexIDSFromPageAndYear(
                currentPage,
                currentYear
            )
            if (celexIDs?.length) {
                let prevEurlexDataJson = {}
                try {
                    const prevEurlexData = await readFileSync(FILE_PATH)
                    prevEurlexDataJson = JSON.parse(prevEurlexData)
                } catch (e) {
                    console.error(e)
                }
                const eurLexData = await getDataFromCelexIDs(celexIDs, prevEurlexDataJson)

                const newMetas = { ...prevEurlexDataJson, ...eurLexData }
                writeFileSync(FILE_PATH, JSON.stringify(newMetas))
            }
        }
    }
}


/**
 * 
 * @param {Array} celexIDs list of celexIDs that will be retrieved from eurlex
 * @param {Object} prevEurlexDataJson JSON object denoting the celexIDs that already have been retrieved in the past
 * @returns Object that contains the document for the celexIDs that are not in the prevEurLexDataJson
 */
async function getDataFromCelexIDs(celexIDs, prevEurlexDataJson) {
    const eurLexData = {}
    for (let i = 0; i < celexIDs.length; i++) {
        const celexID = celexIDs[i]
        if (prevEurlexDataJson?.[celexID]) {
            console.log(`${celexID} --- skipping`)
            continue
        }
        console.log(`${celexID} --- retrvieving`)

        const caseMeta = await getDocumentMeta(celexID)
        const caseBody = await getParsedBody(celexID)
        eurLexData[celexID] = {
            meta: caseMeta,
            body: caseBody,
        }
    }
    return eurLexData
}

module.exports = { getAllCases, getDataFromCelexIDs }
