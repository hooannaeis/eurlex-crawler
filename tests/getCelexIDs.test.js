const { getTotalNumberOfCaseSearchPages, getTotalNumberOFLegalActPages } = require('../src/eurLex/getCelexIDs')

test('getTotalNumberOfCaseSearchPages', async () => {
    expect(await getTotalNumberOfCaseSearchPages(1, 2015)).toEqual(441)
})

test("getTotalNumberOFLegalActPages", async () => {
    expect(await getTotalNumberOFLegalActPages()).toEqual(2056)
})