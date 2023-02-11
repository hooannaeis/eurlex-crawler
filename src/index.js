/**
 * text of case: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62022TN0776&qid=1676118400438
 * meta-information of case: https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62022TN0776&qid=1676118400438
 * 
 */


(async function () {
    const getCaseIDs = require("./utils/getCaseIDs")
    const getCaseMeta = require("./utils/getCaseMeta")
    const caseIDs = await getCaseIDs()
    const caseMetas = []
    if (caseIDs.length) {
        for (let i = 0; i < caseIDs.length; i++) {
            const caseID = caseIDs[i];
            const caseMeta = await getCaseMeta(caseID)
            caseMetas.push(caseMeta)
        }
    }
    console.log(caseMetas)
})()