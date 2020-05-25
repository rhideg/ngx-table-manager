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

    private _tmSelected?: Array<string>;
    private _qsValue?: string;
    private _asArr?: Array<any>;


    constructor(arr?,arrCopy?,arrCols?,arrDispCols?,ds?,count?,empty?,search?)
    {        
      // console.log(search);
      this.search = search ? search : null;
      this.count = count ? count : null;
      this.empty = empty ? empty : null;
      this.arr = arr ? arr : null;
      this.arrCopy = arrCopy ? arrCopy : null;
      this.arrCols = arrCols ? arrCols : null;
      this.ds = ds ? ds : null;
      this.arrDispCols = arrDispCols ? arrDispCols : null;
    }


    tmSelect(arrSelected: Array<string>) {
      console.log(arrSelected);
      this._tmSelected = arrSelected;
      this.completeSearch();
    }

    quickSearch(searchV: string) {
      console.log(searchV);
      this._qsValue = searchV;
      console.log(this.search);
      console.log(this);
      this.completeSearch();
    }

    advancedSearch(searchArr: Array<any>) {
      console.log(searchArr);
      this._asArr = searchArr;
      this.completeSearch();
    }



    completeSearch() {

    }






  }
