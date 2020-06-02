import { Filter } from './filter';

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