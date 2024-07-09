import {
    Match,
    Switch,
    createSignal,
    createMemo,
    onMount,
    Show,
    createEffect,
} from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
    addDoc,
    collection,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from 'firebase/firestore'
import { useFirebaseApp, useFirestore } from 'solid-firebase'
import { Guesses } from './Guesses'
// There are dictionaries available via NPM, such as:
import anagramsList from './assets/words-parsed.json'
import { WordCircle } from './WordCircle'
import AudioPad from './AudioPad'
import anagram from 'anagram'
import Graveyard from './Graveyard'
import Chat from './Chat'

const levels = [
    {
        title: 'Word enjoyer',
        target: Math.floor(anagramsList.length * 0.4),
        confetti: {
            force: 0.2,
            duration: 800,
            particleCount: 100,
            width: 800,
        },
    },
    {
        title: 'Word enthusiast',
        target: Math.floor(anagramsList.length * 0.7),
        confetti: {
            force: 0.4,
            duration: 1200,
            particleCount: 240,
            width: 1200,
        },
    },
    {
        title: 'Master Woorder',
        target: Math.floor(anagramsList.length),
        confetti: {
            confetti: {
                force: 0.6,
                duration: 1400,
                particleCount: 300,
                width: 1600,
            },
        },
    },
]
const WORD = 'SHOCKWAVE'
const WORDGRAVEYARD = `${WORD.toLowerCase()}-graveyard`
const WORDCHAT = `${WORD.toLowerCase()}-chat`
const SCRAMBLED = 'AEVKCHSOW'

function App() {
    const app = useFirebaseApp()
    const db = getFirestore(app)

    const [input, setInput] = createSignal('')
    const [userId, setUserId] = createSignal('')

    const collectionQuery = query(
        collection(db, WORD.toLowerCase()),
        orderBy('timestamp', 'desc')
    )
    const guesses = useFirestore(collectionQuery)

    const [hasError, setHasError] = createSignal(false)

    const playErrorAudio = (audio) => {
        new Audio(`/${audio}.mp3`).play()
    }

    const handleError = (message, audio = 'error') => {
        setHasError(message)
        playErrorAudio(audio)
    }

    const graveyardQuery = query(
        collection(db, WORDGRAVEYARD),
        orderBy('timestamp', 'desc')
    )
    const graveyardItems = useFirestore(graveyardQuery)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedInput = input().trim().toLowerCase()
        const anagrams = anagramsList.map((item) => item.toLowerCase())
        const isValidAnagram = anagrams.includes(parsedInput)

        const alreadyExists = guesses.data.some((item) => {
            return item.value.toLowerCase() === parsedInput
        })

        if (parsedInput.length > 18) {
            handleError('Why are you being stupid')
            return
        }

        if (parsedInput.length < 4) {
            handleError('Word too short (minimum 4 letters)')
            return
        }

        if (alreadyExists) {
            handleError('Word already guessed')
            return
        }

        if (!isValidAnagram) {
            handleError('Sent to graveyard', 'grave')

            console.log(graveyardItems.data)
            console.log(parsedInput)

            // if (
            //     graveyardItems.data.find((word) => word.value === parsedInput)
            // ) {
            //     return
            // }

            await setDoc(doc(db, `${WORDGRAVEYARD}`, parsedInput), {
                value: parsedInput,
                userId: userId(),
                timestamp: Date.now(),
            })
            return
        }

        // // Add a new document in collection "cities"
        await addDoc(collection(db, WORD.toLowerCase()), {
            value: parsedInput,
            userId: userId(),
            timestamp: Date.now(),
        })
        setInput('')
    }

    const getHint = async () => {
        const randomItem =
            anagramsList[
                Math.floor(Math.random() * anagramsList.length)
            ].toLowerCase()

        if (randomItem === WORD.toLowerCase()) {
            getHint()
            return
        }

        let alreadyExists = false

        guesses.data.forEach((item) => {
            if (!alreadyExists) {
                alreadyExists = item.value === randomItem
            }
        })

        if (alreadyExists) {
            getHint()
            return
        }

        // // Add a new document in the guesses db
        await addDoc(collection(db, WORD.toLowerCase()), {
            value: randomItem,
            userId: `${userId()}(hint)`,
            timestamp: Date.now(),
        })
    }

    const handleSetUsername = (e) => {
        setUserId(e.srcElement[0].value)
        // initAudioNotifications()
    }
    return (
        <>
            <Switch>
                <Match when={userId().length}>
                    <div className="column">
                        <AudioPad userId={userId} />
                        {/* <Graveyard items={graveyardItems.data} /> */}
                    </div>
                    <div className="column main">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://nbastreamswatch.com/soccerstreams/1/video.php"
                            frameborder="0"
                            allowfullscreen=""
                        ></iframe>
                    </div>
                    <div className="column">
                        <Chat word={WORDCHAT} userId={userId} />
                    </div>
                </Match>

                <Match when={!userId().length}>
                    <form onSubmit={handleSetUsername}>
                        <h3>Enter Username</h3>
                        <input type="text" required />
                        <button type="submit">Submit</button>
                    </form>
                </Match>
            </Switch>
        </>
    )
}

export default App
