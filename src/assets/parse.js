import fs from 'fs'

const data = fs.readFileSync('all-words.txt', 'utf8')

const words = data.replaceAll('\n', '').replaceAll(' ', '\r').split('\r')

console.log(words)
const parsedData = words.filter((word, i) => word.length && word.includes('N'))

const uniqueWords = [...new Set(parsedData)]

fs.writeFileSync('words-parsed.json', JSON.stringify(uniqueWords))
console.log('Successfully parsed word. Total results: ' + uniqueWords.length)
