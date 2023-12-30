import { For } from 'solid-js'

export const WordCircle = ({ word }) => {
    return (
        <div className="word-circle">
            <For each={word.split('')}>
                {(letter, i) => (
                    <span className={i() === 4 ? 'target' : ''}>{letter}</span>
                )}
            </For>
        </div>
    )
}
