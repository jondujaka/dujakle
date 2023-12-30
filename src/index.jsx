/* @refresh reload */
import { render } from 'solid-js/web'
import { initializeApp } from 'firebase/app'
import { FirebaseProvider } from 'solid-firebase'

import './index.css'
import App from './App'

const firebaseConfig = {
    apiKey: 'AIzaSyB996ACFaojO6YN-95AxWlHF3Wpdo8yYNo',

    authDomain: 'dujakle.firebaseapp.com',

    projectId: 'dujakle',

    storageBucket: 'dujakle.appspot.com',

    messagingSenderId: '83608100462',

    appId: '1:83608100462:web:6603ee6a3bf0401169107f',
}

const app = initializeApp(firebaseConfig)
const root = document.getElementById('root')

render(
    () => (
        <FirebaseProvider app={app}>
            <App />
        </FirebaseProvider>
    ),
    root
)
