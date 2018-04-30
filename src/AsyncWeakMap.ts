import {existing} from '@pinyin/maybe'

export class AsyncWeakMap<K extends object, V> {
    public async get(key: K): Promise<V> {
        const {callbackSets, values} = this
        const current = values.get(key)
        if (existing(current)) {
            return Promise.resolve(current)
        }
        let callback: Callback<V>
        const callbackSet = callbackSets.get(key) || new Set<Callback<V>>()
        callbackSet.add((v: V) => callback(v))
        callbackSets.set(key, callbackSet)
        return new Promise<V>(resolve => callback = resolve) // TODO potential memory leak
    }

    public set(key: K, value: V): this {
        const {callbackSets, values} = this

        values.set(key, value)
        const callbackSet = callbackSets.get(key)
        if (existing(callbackSet)) {
            callbackSet.forEach(callback => callback(value))
        }
        callbackSets.delete(key)

        return this
    }

    public delete(key: K): boolean {
        const {values} = this
        return values.delete(key);
    }

    public has(key: K): boolean {
        const {values} = this
        return values.has(key);
    }

    private callbackSets = new WeakMap<K, Set<Callback<V>>>()
    private values = new WeakMap<K, V>()
}

type Callback<T> = (value: T) => void
