import fs from 'fs'

const data = fs.readFileSync('word-parsed.json', 'utf8')

console.log(typeof data)

const uniqueWords = [...new Set(JSON.parse(data))]

const parsedData = uniqueWords.filter((word, i) => word.includes('t'))

console.log(parsedData.length)

fs.writeFileSync('word-parsed1.json', JSON.stringify(parsedData))
