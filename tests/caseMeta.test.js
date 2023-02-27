const {
    getCelexIDFromString,
    getDocumentSpecifierFromReference,
    getTokenizedReferences,
} = require('../src/utils/caseMeta')

test('getCelexIDFromString', () => {
    expect(
        getCelexIDFromString(
            'submits a preliminary question about 31990l0619 article 15 paragraph 1'
        )
    ).toEqual(['31990l0619'])
    expect(
        getCelexIDFromString(
            'submits a preliminary question about 31990lasdf0619 article 15 paragraph 1'
        )
    ).toEqual([])
})

test('getDocumentSpecifierFromReference', () => {
    expect(
        getDocumentSpecifierFromReference(
            'submits a preliminary question about 31990l0619 article 15 paragraph 1'
        )
    ).toEqual(['article 15', 'paragraph 1'])
    expect(
        getDocumentSpecifierFromReference(
            'submits a preliminary question about 31990l0619 article 15 paragraph 1 number 123'
        )
    ).toEqual(['article 15', 'paragraph 1', 'number 123'])
    expect(getDocumentSpecifierFromReference('32017r1001')).toEqual([])
})

test('getTokenizedReferences', () => {
    expect(
        getTokenizedReferences([
            'submits a preliminary question about 31990l0619 article 15 paragraph 1',
        ])
    ).toEqual([['31990l0619', 'article 15', 'paragraph 1']])
    expect(getTokenizedReferences('not an array')).toEqual([])
})
