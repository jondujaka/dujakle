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
import anagramsList from './assets/word-parsed.json'
import { WordCircle } from './WordCircle'

const WORD = 'ACROBATIC'
const SCRAMBLED = 'RBACTOCIA'
function App() {
    const [input, setInput] = createSignal('')
    const [userId, setUserId] = createSignal('')

    const app = useFirebaseApp()
    const db = getFirestore(app)
    const guessesQuery = createMemo(() =>
        query(collection(db, 'guesses'), orderBy('timestamp', 'desc'))
    )
    const guesses = useFirestore(guessesQuery)

    const [hasError, setHasError] = createSignal(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const parsedInput = input().toLowerCase()
        const isValidAnagram = anagramsList.includes(parsedInput)

        console.log(guesses.data)
        const alreadyExists = guesses.data.some((item) => {
            return item.value.toLowerCase() === parsedInput
        })

        if (!isValidAnagram) {
            setHasError('Invalid word')
            return
        }

        if (alreadyExists) {
            setHasError('Word already guessed')
            return
        }

        // // Add a new document in collection "cities"
        await addDoc(collection(db, 'guesses'), {
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
