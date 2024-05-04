import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore'
import { createSignal } from 'solid-js'

export default function useFirestore(app) {
    const db = getFirestore(app)

    async function addData(collectionName, data, userId) {
        const doc = await addDoc(collection(db, collectionName), {
            ...data,
            userId,
            created: Timestamp.now(),
        })
    }

    function getData(collectionName) {
        const [data, setData] = createSignal([])
        getDocs(collection(db, collectionName)).then((records) => {
            setData(records.docs.map((doc) => doc.data()))
        })

        const q = query(
            collection(db, collectionName),
            orderBy('created', 'asc')
        )
        onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map((doc) => doc.data()))
        })
        return data
    }

    return { db, addData, getData }
}
