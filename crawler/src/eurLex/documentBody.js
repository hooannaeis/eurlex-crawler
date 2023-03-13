const { getParsedHtml, getListTextsBySelector } = require('./utilities')

/**
 * @param {String} celexID celex ID the uniquely identifies a document on eurlex (https://eur-lex.europa.eu/content/help/eurlex-content/celex-number.html#:~:text=A%20CELEX%20number%20is%20a,on%20the%20type%20of%20document.)
 * @returns list of paragraphs that the document contains
 */
async function getParsedBody(celexID) {
    const CASE_BODY_URL = `https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=${encodeURIComponent(
        'CELEX:' + celexID
    )}`
    try {
        const caseBody = await getParsedHtml(CASE_BODY_URL)
        const caseParagraphs = getListTextsBySelector(caseBody, 'body p', true)
        if (caseParagraphs?.length) {
            return caseParagraphs
        }
        return ['no body found']
    } catch (e) {
        console.log(`case not default english: ${CASE_BODY_URL}`)
        return ['something went wrong']
    }
}

module.exports = { getParsedBody }
