import { useFirebaseApp, useFirestore } from 'solid-firebase'
import {
    addDoc,
    collection,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore'

import { For, createSignal, createEffect, Match, Switch } from 'solid-js'

const Chat = ({ word, userId }) => {
    const app = useFirebaseApp()
    const db = getFirestore(app)

    const chatQuery = query(collection(db, word), orderBy('timestamp', 'asc'))
    const chatItems = useFirestore(chatQuery)

    const handleSendMessage = async (e) => {
        e.preventDefault()
        const msgElement = e.srcElement[0]
        const msg = msgElement.value

        if (msg.length > 256) {
            return
        }

        await addDoc(collection(db, word), {
            value: msg,
            userId: userId(),
            timestamp: Date.now(),
        })

        msgElement.value = ''
    }

    let scrollableDiv
    createEffect(() => {
        const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    if (scrollableDiv) {
                        console.log()
                        scrollableDiv.scrollTop = scrollableDiv.scrollHeight
                    }
                }
            })
        })
    })

    const getTimeStamp = (time) => {
        const date = new Date(time)
        const hours = date.getHours()
        const mins = date.getMinutes()
        const sec = date.getSeconds()

        return {
            time: `[${hours}:${mins}:${sec}]`,
            full: date,
        }
    }

    return (
        <>
            <Switch>
                <Match when={chatItems.data}>
                    <h2>Chat </h2>
                    <div className="chat">
                        <div
                            ref={scrollableDiv}
                            className="chat-scroll"
                            id="chat-scroll"
                        >
                            <For each={chatItems.data}>
                                {(item, i) => {
                                    const timestamp = getTimeStamp(
                                        item.timestamp
                                    )

                                    return (
                                        <>
                                            <span>
                                                <em title={timestamp.full}>
                                                    {timestamp.time}
                                                </em>
                                                <b>{item.userId}: </b>
                                                {item.value}
                                            </span>
                                        </>
                                    )
                                }}
                            </For>
                        </div>
                    </div>
                </Match>
            </Switch>
            <div className="chat-form">
                <form onSubmit={handleSendMessage}>
                    <input
                        autocomplete="off"
                        type="text"
                        name="message"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}

export default Chat
