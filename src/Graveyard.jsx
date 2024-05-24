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

const Graveyard = ({ word }) => {
    const app = useFirebaseApp()
    const db = getFirestore(app)

    const graveyardQuery = query(
        collection(db, word.toLowerCase()),
        orderBy('timestamp', 'desc')
    )
    const guesses = useFirestore(collectionQuery)

    return <div></div>
}

export default Graveyard
