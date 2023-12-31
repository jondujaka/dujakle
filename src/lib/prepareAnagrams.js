const WORD = 'EEPOTHRNU'

import { createDictionary } from './anagram.js'

import { WordGenerator } from './words.js'

const wordGenerator = new WordGenerator()

const init = async () => {
    const dict = createDictionary('./collins-dict.txt')
    console.log(dict)

    // await wordGenerator.generateTree()
}

init()
