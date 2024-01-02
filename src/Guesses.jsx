import { For, createSignal, splitProps, Show } from 'solid-js'

import { ConfettiExplosion } from 'solid-confetti-explosion'

import anagramsList from './assets/words-parsed.json'

export const Guesses = (props) => {
    const [sort, setSort] = createSignal('')
    const [explode, setExplode] = createSignal(false)
    const { items, totalCount, targetWord, levels } = props

    anagramsList.forEach((anagramItem) => {
        console.log(items.length)

        let isGuessed = false
        items.forEach((item) => {
            if (!isGuessed) {
                isGuessed = item.value === anagramItem
            }
        })

        if (!isGuessed) {
            console.log(anagramItem)
        }
    })

    const largeConfettiProps = {
        force: 0.8,
        duration: 3000,
        particleCount: 300,
        width: 1600,
        colors: ['#041E43', '#1471BF', '#5BB4DC', '#FC027B', '#66D805'],
    }

    return (
        <div className="guesses">
            <div className="guesses-list valid">
                <h3>Guesses: {items.length} / {totalCount}</h3>
                <div className="targets">
                    <span>Targets:</span>
                    <ul>
                        {levels.map((level) => (
                            <li
                                className={
                                    level.target <= items.length && 'active'
                                }
                            >
                                {level.title} ({level.target})
                                <Show when={items.length === level.target}>
                                    <ConfettiExplosion
                                        {...level.confetti}
                                    />
                                </Show>
                            </li>
                        ))}
                    </ul>
                </div>

                <For each={items}>
                    {(item, i) => (
                        <>
                            <div className="single-guess">
                                <span>{item.value.length}</span>
                                <a
                                    href={`https://en.wiktionary.org/wiki/${item.value}#English`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.value}
                                    <span>({item.userId})</span>
                                </a>
                            </div>
                        </>
                    )}
                </For>
            </div>
        </div>
    )
}
