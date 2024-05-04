import fs from 'fs'

const data = fs.readFileSync('all-words.txt', 'utf8')

const words = data.split('\r\n')

console.log(words)
const parsedData = words.filter((word, i) => word.length && word.includes('d'))

const uniqueWords = [...new Set(parsedData)]

fs.writeFileSync('words-parsed.json', JSON.stringify(uniqueWords))
console.log('Successfully parsed word. Total results: ' + uniqueWords.length)
