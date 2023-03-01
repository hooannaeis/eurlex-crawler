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

;(async function () {
    const { getAllCases } = require('./eurLex/cases')
    const { getAllLegalActs } = require('./eurLex/legalActs')
    await getAllLegalActs()
    await getAllCases()
})()
