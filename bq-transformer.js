;(async function () {
    const { writeFileSync, readFileSync } = require('fs')
    const file = await readFileSync('eurlexdata.json')
    const fileJson = JSON.parse(file)

    const newJson = []
    Object.keys(fileJson).forEach((itemKey) => {
        const entry = fileJson[itemKey]
        newJson.push({ ...entry.caseMeta, caseBody: entry.caseBody })
    })
    writeFileSync('eurlexdata-bq.json', JSON.stringify(newJson))
})()
