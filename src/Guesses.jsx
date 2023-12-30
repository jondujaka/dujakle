import { For, splitProps } from 'solid-js'

export const Guesses = (props) => {
    const { items, totalCount } = props
    return (
        <div className="guesses">
            <div className="guesses-list valid">
                <h3>
                    Guesses: {items.length} / {totalCount}
                </h3>
                <For each={items}>
                    {(item, i) => (
                        <a
                            href={`https://en.wiktionary.org/wiki/${item.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.value} <span>({item.userId})</span>
                        </a>
                    )}
                </For>
            </div>
        </div>
    )
}
