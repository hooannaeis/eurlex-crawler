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

    const FILE_PATH = './data/eurlexLegalActs.json'

    const maxPages = await getTotalNumberOFLegalActPages()

    for (let currentPage = 1; currentPage <= maxPages; currentPage += 1) {
        console.log(`page: ${currentPage}/${maxPages}`)
        const celexIDs = await getLegalActIDs(currentPage)
        if (celexIDs.length) {
            let prevEurlexDataJson = {}
            try {
                const prevEurlexData = await readFileSync(FILE_PATH)
                prevEurlexDataJson = JSON.parse(prevEurlexData)
            } catch (e) {
                console.error(e)
            }
            const eurLexData = await getDataFromCelexIDs(celexIDs, prevEurlexDataJson)

            const newMetas = { ...prevEurlexDataJson, ...eurLexData }
            await writeFileSync(FILE_PATH, JSON.stringify(newMetas))
        }
    }
}

async function getDataFromCelexIDs(celexIDs, prevEurlexDataJson) {
    const eurLexData = {}
    for (let i = 0; i < celexIDs.length; i++) {
        const celexID = celexIDs[i]
        if (prevEurlexDataJson[celexID]) {
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

module.exports = { getAllLegalActs, getDataFromCelexIDs }
