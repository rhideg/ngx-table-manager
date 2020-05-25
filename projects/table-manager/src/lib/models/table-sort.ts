import { AdvancedSearchService } from '../services/advanced-search.service';

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


    /**
     * 
     * @param arr Array data to show. (This will be shown.)
     * @param arrCopy Copy of the whole data. Always stays the same.
     * @param arrCols 
     * @param arrDispCols 
     * @param ds 
     * @param count 
     * @param empty 
     * @param search 
     */
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


    /**
     * Filters based on the selected values for one column from a dropdown list.
     * @param arrSelected Selected conditions.
     */
    tmSelect(arrSelected: Array<string>) {
      console.log(arrSelected);
      this._tmSelected = arrSelected;
      this.completeSearch();
    }

    /**
     * Quick search only performs search for one give column.
     * @param searchV Search value and current column.
     */
    quickSearch(searchV: string) {
      console.log(searchV);
      this._qsValue = searchV;
      console.log(this.search);
      // console.log(this);
      this.completeSearch();
    }


    columnSearch() {

    }


    /**
     * Advanced search filters the data based on multiple conditions.
     * @param searchArr What to search for in which column.
     */
    advancedSearch(searchArr: Array<any>) {
      console.log(searchArr);
      this._asArr = searchArr;
      // this.completeSearch();
    }


    completeSearch() {
      console.log(this._qsValue);
      if (this._qsValue === undefined || this._qsValue === '') {
        this.count = 30;
        this.arr = this.arrCopy;
        this.empty = false;
      } else {
        let arrSearched = this.arrCopy;
  
        arrSearched = this.arrCopy.filter(szall => {
          if (
            szall[`${this.search.name}`] &&
            szall[`${this.search.name}`]
              .toString()
              .toLowerCase()
              .includes(this._qsValue.toString().toLowerCase())
          ) {
            return szall;
          }
        });
  
        this.arr = arrSearched;
        console.log(arrSearched);
        if (this.arr.length === 0) {
          this.empty = true;
        } else {
          this.count = 30;
          this.empty = false;
        }
      }

    }






  }
