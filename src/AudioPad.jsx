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
        label: 'Laugh',
        slug: 'laugh',
    },
    {
        label: 'Run',
        slug: 'run',
    },
    {
        label: 'Airhorn',
        slug: 'airhorn',
    },
    {
        label: 'Dubsiren',
        slug: 'dubsiren',
    },
    {
        label: 'Loon',
        slug: 'loon',
    },
]

const playFile = (file) => {
    new Audio(`/${file}.mp3`).play()
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
        playFile(audioData.value)
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
        window.setTimeout(() => {
            setHasAudio(true)
        }, 1000)
    })

    return (
        <>
            <h2>Brain rot pad</h2>
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
                                audioTimeout()
                                    ? 'You have to wait 10 seconds'
                                    : item.label
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
