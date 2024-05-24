import fs from 'fs'

const data = fs.readFileSync('all-words.txt', 'utf8')

const words = data.split('\n')

const parsedData = words
    .filter((word) => word.length && word.includes('C'))
    .map((word) => {
        if (!word.includes('(')) {
            return word
        }

        const wordEnd = word.indexOf('(')
        return word.substring(0, wordEnd).trim()
    })

const uniqueWords = [...new Set(parsedData)]

fs.writeFileSync('words-parsed.json', JSON.stringify(uniqueWords))
console.log('Successfully parsed word. Total results: ' + uniqueWords.length)
