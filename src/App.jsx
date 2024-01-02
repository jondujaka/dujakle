import {
    Match,
    Switch,
    createSignal,
    createMemo,
    onMount,
    Show,
} from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
    addDoc,
    collection,
    getFirestore,
    orderBy,
    query,
} from 'firebase/firestore'
import { useFirebaseApp, useFirestore } from 'solid-firebase'
import { Guesses } from './Guesses'
// There are dictionaries available via NPM, such as:
import anagramsList from './assets/words-parsed.json'
import { WordCircle } from './WordCircle'

const WORD = 'LABORIOUS'

const SCRAMBLED = 'OABRUOISL'

const levels = [
    {
        title: 'Word enjoyer',
        target: Math.floor(anagramsList.length * 0.25),
        confetti: {
            force: 0.2,
            duration: 800,
            particleCount: 100,
            width: 800,
        }
    },
    {
        title: 'Word enthusiast',
        target: Math.floor(anagramsList.length * .5),
        confetti: {
            force: 0.4,
            duration: 1200,
            particleCount: 240,
            width: 1200,
        }
    },
    {
        title: 'Master Woorder',
        target: Math.floor(anagramsList.length * .75),
        confetti: {
            confetti: {
                force: 0.6,
                duration: 1400,
                particleCount: 300,
                width: 1600,
            }
        }
    },
    {
        title: 'Word obliterator',
        target: anagramsList.length,
        confetti: {
            confetti: {
                force: 1,
                duration: 2500,
                particleCount: 1000,
                width: 1800,
            }
        }
    },
]
function App() {
    const [input, setInput] = createSignal('')
    const [userId, setUserId] = createSignal('')

    const app = useFirebaseApp()
    const db = getFirestore(app)
    const guessesQuery = createMemo(() =>
        query(collection(db, WORD.toLowerCase()), orderBy('timestamp', 'desc'))
    )
    const guesses = useFirestore(guessesQuery)

    const [hasError, setHasError] = createSignal(false)

    const handleError = (message) => {
        const errorAudio = new Audio('/error.mp3')
        errorAudio.play()
        setHasError(message)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedInput = input().trim().toLowerCase()
        const isValidAnagram = anagramsList.includes(parsedInput)

        console.log(guesses.data)
        const alreadyExists = guesses.data.some((item) => {
            return item.value.toLowerCase() === parsedInput
        })

        if (parsedInput.length < 4) {
            handleError('Word too short (minimum 4 letters)')
            return
        }

        if (!isValidAnagram) {
            handleError('Invalid word')
            return
        }

        if (alreadyExists) {
            handleError('Word already guessed')
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

    const handleSetUsername = (e) => {
        setUserId(e.srcElement[0].value)
    }
    return (
        <>
            <Switch>
                <Match when={userId().length}>
                    <div>
                        <WordCircle word={SCRAMBLED} />
                    </div>

                    <Show when={hasError()}>
                        <span className="error">{hasError()}</span>
                    </Show>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            required
                            value={input()}
                            onInput={(e) => {
                                setHasError(false)
                                setInput(e.currentTarget.value)
                            }}
                        />
                        <button type="submit">Submit</button>
                    </form>
                    <div>
                        <Switch>
                            <Match when={guesses.loading}>
                                <p>Loading...</p>
                            </Match>
                            <Match when={guesses.error}>
                                <p>An error occurred.</p>
                            </Match>
                            <Match when={guesses.data}>
                                <Guesses
                                    items={guesses.data}
                                    levels={levels}
                                    totalCount={anagramsList.length}
                                />
                            </Match>
                        </Switch>
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
