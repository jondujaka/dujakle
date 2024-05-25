import { For, Match, Switch } from 'solid-js'

const Graveyard = ({ items }) => {
    return (
        <Switch>
            <Match when={items}>
                <div className="graveyard">
                    <h2>Graveyard </h2>
                    <div className="graveyard-scroll">
                        <For each={items}>
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
