/**
 * search: Seach keyword.
 * count: How many items to show.
 * empty: Has value.
 * arr: Data array.
 * arrCopy: Deep copy of the arr.
 * arrCols: Columns with metadata.
 * ds: Material Data Source. !!! WILL BE DEPRECATED !!!
 * arrDispCols: Displayable columns in a string array. !!! WILL BE DEPRECATED !!!
 */
export class TableSort {
    search: any;
    count: number;
    empty: boolean;
    arr: any[];
    arrCopy: any[];
    arrCols: any[];
    ds?: any;
    arrDispCols?: string[];

    constructor(tableSort?: TableSort) {
      this.search = tableSort ? tableSort.search : null;
      this.count = tableSort ? tableSort.count : null;
      this.empty = tableSort ? tableSort.empty : null;
      this.arr = tableSort ? tableSort.arr : null;
      this.arrCopy = tableSort ? tableSort.arrCopy : null;
      this.arrCols = tableSort ? tableSort.arrCols : null;
      this.ds = tableSort ? tableSort.ds : null;
      this.arrDispCols = tableSort ? tableSort.arrDispCols : null;
    }

    
  }
