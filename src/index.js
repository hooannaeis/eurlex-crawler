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
    const { getCelexIDSFromPageAndYear, getTotalNumberOfSearchPages } = require("./utils/celexIDs")
    const { getDocumentMeta } = require("./utils/caseMeta")
    const { writeFileSync, readFileSync } = require("fs")
    const FILE_PATH = "metas.json"

    const maxYear = new Date().getFullYear()
    let currentYear = 2022 // in production change this to the first year of data (e. g. 2010)
    let currentPage = 1
    const maxPages = await getTotalNumberOfSearchPages(currentPage, currentYear)
    for (currentYear; currentYear <= maxYear; currentYear += 1) {
        console.log(`currentYear: ${currentYear} of ${maxYear}`)
        for (currentPage; currentPage <= maxPages; currentPage += 1) {
            console.log(`currentPage: ${currentPage} of ${maxPages}`)
            const celexIDs = await getCelexIDSFromPageAndYear(currentPage, currentYear)
            const caseMetas = []
            if (celexIDs.length) {
                for (let i = 0; i < celexIDs.length; i++) {
                    const celexID = celexIDs[i];
                    const caseMeta = await getDocumentMeta(celexID)
                    caseMetas.push(caseMeta)
                }
            }
            let prevMetasJson = []
            try {
                const prevMetas = await readFileSync(FILE_PATH)
                prevMetasJson = JSON.parse(prevMetas)
            } catch (e) {
                console.error(e)
            }

            const newMetas = [...prevMetasJson, ...caseMetas]
            await writeFileSync(FILE_PATH, JSON.stringify(newMetas))
        }
    }

})()
