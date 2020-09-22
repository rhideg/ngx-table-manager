import { Filter } from './filter';

/** 
 * Model for the extra columns in the table.
 * 
 * Example:
    type: 'btnEdit',
    icon: 'edit',
    filter: [
        { col: 'name', value: ['test1', 'test3'], relation: '===' }
    ],
    tooltip: 'Edit',
    inFrom: true
 */
export interface ExtraCols {
    type?: string;
    icon?: string;
    style?: any;
    filter?: Array<Filter>;
    tooltip?: string;
    inFront?: boolean;
}

