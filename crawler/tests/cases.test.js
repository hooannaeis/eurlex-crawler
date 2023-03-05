const { getDataFromCelexIDs } = require("./../src/eurLex/cases")

test("getDataFromCelexIDs", async () => {
    const MOCK_CELEX_ID = "62015TB0161"
    const caseDataRaw = await getDataFromCelexIDs([MOCK_CELEX_ID])
    const caseData = caseDataRaw[MOCK_CELEX_ID]
    expect(caseData).toHaveProperty('meta');
    expect(caseData).toHaveProperty('body');
    expect(caseData.meta.id).toEqual(MOCK_CELEX_ID)
    expect(caseData.meta.tags).toHaveLength(10)
    expect(caseData.meta.references.raw).toHaveLength(3)
    expect(caseData.body).toHaveLength(20)
})