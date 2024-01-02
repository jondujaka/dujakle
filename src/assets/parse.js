import fs from 'fs'

const data = fs.readFileSync('all-words.txt', 'utf8')

const words = data.split('\n')

const parsedData = words.filter((word, i) => word.length && word.includes('u'))

const uniqueWords = [...new Set(parsedData)]

console.log(uniqueWords.length)

fs.writeFileSync('words-parsed.json', JSON.stringify(uniqueWords))
