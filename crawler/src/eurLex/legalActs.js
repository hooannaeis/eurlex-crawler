const {
    getLegalActIDs,
    getTotalNumberOFLegalActPages,
} = require('./getCelexIDs')
const { getDocumentMeta } = require('./documentMeta')
const { getParsedBody } = require('./documentBody')
const { writeFileSync, readFileSync } = require('fs')

async function getAllLegalActs() {
    console.log("GETTING LEGAL ACTS")
    console.log("------------------")

    const FILE_PATH = 'eurlexLegalActs.json'

    const maxPages = await getTotalNumberOFLegalActPages()

    for (let currentPage = 1; currentPage <= maxPages; currentPage += 1) {
        console.log(`page: ${currentPage}/${maxPages}`)
        const celexIDs = await getLegalActIDs(currentPage)
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

module.exports = { getAllLegalActs, getDataFromCelexIDs }
