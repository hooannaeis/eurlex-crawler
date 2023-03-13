; (async function () {
    const { writeFileSync, readFileSync } = require('fs')
    const file = await readFileSync('eurLexLegalActs.json')
    const fileJson = JSON.parse(file)

    const newJson = []
    Object.keys(fileJson).forEach((itemKey) => {
        const entry = fileJson[itemKey]
        newJson.push({ ...entry.meta, body: entry.body })
    })
    writeFileSync('eurLexLegalActs-bq.json', JSON.stringify(newJson))
})()
