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

const Graveyard = ({ word, userId }) => {
    const app = useFirebaseApp()
    const db = getFirestore(app)

    const graveyardQuery = query(
        collection(db, word),
        orderBy('timestamp', 'desc')
    )
    const graveyardItems = useFirestore(graveyardQuery)

    return (
        <Switch>
            <Match when={graveyardItems.data}>
                <div className="graveyard">
                    <h2>Graveyard </h2>
                    <div className="graveyard-scroll">
                        <For each={graveyardItems.data}>
                            {(item, i) => (
                                <>
                                    <div>
                                        <span>{item.value}</span>
                                        <span>({item.userId})</span>
                                    </div>
                                </>
                            )}
                        </For>
                    </div>
                </div>
            </Match>
        </Switch>
    )
}

export default Graveyard
