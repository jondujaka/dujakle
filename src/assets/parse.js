import fs from 'fs'

const data = fs.readFileSync('word-parsed.json', 'utf8')

console.log(typeof data)

const parsedData = JSON.parse(data).filter((word) => word.includes('t'))

console.log(parsedData.length)

fs.writeFileSync('word-parsed1.json', JSON.stringify(parsedData))
