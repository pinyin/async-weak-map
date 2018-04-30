import {AsyncWeakMap} from './AsyncWeakMap'

describe(`${AsyncWeakMap.name}`, () => {
    const map: AsyncWeakMap<object, number> = new AsyncWeakMap()

    test(`it should be creatable when called with no params`, () => {
        expect(map).toBeInstanceOf(AsyncWeakMap)
    })

    const k1 = {}
    const k2 = {}

    test(`it should return promise when get`, () => {
        expect(map.get(k1)).toBeInstanceOf(Promise)
        expect(map.get(k2)).toBeInstanceOf(Promise)
    })

    test(`it should return previous value if there is one`, async () => {
        map.set(k1, 1)
        map.set(k2, 2)
        expect(map.has(k1)).toBe(true)
        expect(map.has(k2)).toBe(true)
        expect(await map.get(k1)).toEqual(1)
        expect(await map.get(k2)).toEqual(2)
    })

    test(`it should be able to change saved value`, async () => {
        map.delete(k1)
        map.delete(k2)
        expect(map.has(k1)).toBe(false)
        expect(map.has(k2)).toBe(false)
        map.set(k1, 3)
        map.set(k2, 4)
        expect(map.has(k1)).toBe(true)
        expect(map.has(k2)).toBe(true)
        expect(await map.get(k1)).toEqual(3)
        expect(await map.get(k2)).toEqual(4)
    })

})
