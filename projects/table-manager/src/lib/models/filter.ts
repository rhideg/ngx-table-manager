import { Relations } from './relations';

/**
 * Filter model for the extra clumns and select models.
 * 
 * Example:
 * { col: 'type', value: ['a', 'b'], relation: '===' },
 * 
 */
export interface Filter {
    col: string;
    value: Array<any>;
    relation: Relations;
}