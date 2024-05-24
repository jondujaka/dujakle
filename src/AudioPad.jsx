import { useFirebaseApp } from 'solid-firebase'
import {
    addDoc,
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore'

import { For, createSignal, createEffect } from 'solid-js'

const audioList = [
    {
        label: 'Bruh',
        slug: 'bruh',
    },
    {
        label: 'OMG',
        slug: 'omg',
    },
    {
        label: 'WTS',
        slug: 'wts',
    },
    {
        label: 'AAAA',
        slug: 'augh',
    },
    {
        label: 'Bruh',
        slug: 'bruh',
    },
    {
        label: 'Run',
        slug: 'run',
    },
]

let audioInit = false
const audioQueue = []
const alreadyPlayed = []

let allowNext = true

const initAudioPlayer = () => {
    window.setInterval(() => {
        if (!audioQueue.length) {
            return
        }

        if (!allowNext) {
            return
        }

        const newAudio = audioQueue.shift()
        const audioPlayer = new Audio(`/${newAudio.value}.mp3`)
        allowNext = false

        audioPlayer.onended = function () {
            allowNext = true
            alreadyPlayed.push(newAudio.id)
        }
        audioPlayer.play()
    }, 200)
}
const AudioPad = ({ userId }) => {
    const app = useFirebaseApp()
    const db = getFirestore(app)

    const [hasAudio, setHasAudio] = createSignal(false)
    const [audioTimeout, setAudioTimeout] = createSignal(false)

    const playAudio = (audioData) => {
        if (!hasAudio()) {
            return
        }
        audioQueue.push(audioData)
    }

    const brainrot = query(
        collection(db, 'brainrot'),
        orderBy('timestamp', 'desc')
    )

    createEffect(() => {
        const unsubscribe = onSnapshot(brainrot, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    playAudio({
                        ...change.doc.data(),
                        id: change.doc.id,
                    })
                }
            })
        })
    })

    const sendAudio = async (audio) => {
        setAudioTimeout(true)
        window.setTimeout(() => setAudioTimeout(false), 10000)
        await addDoc(collection(db, 'brainrot'), {
            value: audio,
            userId: userId(),
            timestamp: Date.now(),
        })
    }

    createEffect(() => {
        if (audioInit) {
            return
        }
        initAudioNotifications()
    })

    const initAudioNotifications = () => {
        window.setTimeout(() => {
            audioInit = true
            setHasAudio(true)
            initAudioPlayer()
        }, 1000)
    }

    return (
        <>
            <h3>Brain rot pad</h3>
            <div className="audio-pad">
                <For each={audioList}>
                    {(item, i) => (
                        <button
                            className={`sound-button ${
                                audioTimeout() && 'disabled'
                            }`}
                            onClick={() => sendAudio(item.slug)}
                            disabled={audioTimeout()}
                            title={
                                audioTimeout() ? 'You have to wait' : item.label
                            }
                        >
                            {item.label}
                        </button>
                    )}
                </For>
            </div>
        </>
    )
}

export default AudioPad
