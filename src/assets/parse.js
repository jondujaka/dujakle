import fs from 'fs'

const data = fs.readFileSync('all-words.txt', 'utf8')

const words = data.split('\r\n')

const parsedData = words.filter((word, i) => word.includes('t'))

const uniqueWords = [...new Set(parsedData)]

console.log(uniqueWords.length)

fs.writeFileSync('words-parsed.json', JSON.stringify(uniqueWords))
