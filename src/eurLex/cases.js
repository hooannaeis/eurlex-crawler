const {
    getCelexIDSFromPageAndYear,
    getTotalNumberOfCaseSearchPages,
} = require('./getCelexIDs')
const { getDocumentMeta } = require('./documentMeta')
const { getParsedBody } = require('./documentBody')
const { writeFileSync, readFileSync } = require('fs')

async function getAllCases() {
    console.log("GETTING CASES")
    console.log("-------------")
    const FILE_PATH = 'eurlexCases.json'

    const maxYear = new Date().getFullYear()
    for (let currentYear = 2015; currentYear <= maxYear; currentYear += 1) {
        console.log(`currentYear: ${currentYear} of ${maxYear}`)
        const maxPages = await getTotalNumberOfCaseSearchPages(1, currentYear)

        for (let currentPage = 1; currentPage <= maxPages; currentPage += 1) {
            console.log(`page: ${currentPage}/${maxPages}`)
            const celexIDs = await getCelexIDSFromPageAndYear(
                currentPage,
                currentYear
            )
            if (celexIDs.length) {
                const eurLexData = await getDataFromCelexIDs(celexIDs)
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
    }
}

async function getDataFromCelexIDs(celexIDs) {
    const eurLexData = {}
    for (let i = 0; i < celexIDs.length; i++) {
        const celexID = celexIDs[i]
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
