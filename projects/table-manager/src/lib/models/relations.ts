/**
 * Enum relations for the filters.
 * 
 * Example filter:
 * { col: 'type', value: ['a', 'b'], relation: eq },
 */
export enum Relations {
    length = 'length',
    eq = '===',
    ne = '!==',
    ge = '<=',
    gt = '<',
    le = '>=',
    lt = '>'
}