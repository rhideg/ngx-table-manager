/** 
 * Model for the extra columns in the table.
 * 
 * Example:
    type: 'btnEdit',
    icon: 'edit',
    filter: [
        { col: 'name', value: ['test1', 'test3'], relation: '===' }
    ],
    tooltip: 'Edit'
 */
export interface ExtraCols {
    type?: string;
    icon?: string;
    style?: any;
    filter?: Array<Filter>;
    tooltip?: string;
}


 /**
  * Model for the select column in the table with options.
  * 
  * Example:
    type: 'select',
    multi: true,
    filter: [
        { col: 'type', value: ['a', 'b'], relation: '===' },
        { col: 'id', value: [5], relation: '>' }
    ],
  */
export interface Select {
    type?: string;
    multi?: boolean;
    filter?: Array<Filter>;
}


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
    ge = '>=',
    gt = '>',
    le = '<=',
    lt = '<'
}


/**
 * 
 */
export interface Search {
    title: string; 
    name: string; 
    show?: boolean;
    sticky?: boolean;
}





