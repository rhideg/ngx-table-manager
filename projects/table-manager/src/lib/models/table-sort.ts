import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Select, ExtraCols, Search } from './interfaces';

export class TableSort {
  search: Search;
  count: number;
  empty: boolean;
  arr: any[];
  arrCopy: any[];
  arrCols: any[];
  ds?: any;
  arrDispCols?: string[];

  // private _tmSelected?: { arrSelected?: Array<string>, column?: string };
  private _tmSelected?: any;
  private _qsValue?: string;
  private _asArr?: Array<any>;
  private _objColSearch?: any;

  private _sort: MatSort;

  arrSelected: Array<any>;

  // FROM NGX TABLE:
  private _select: Select;
  private _extraCols: Array<ExtraCols>;
  private _arrDispColsAll: Array<any>;
  private _arrColsAll: Array<any>;

  
  // Select get, set
  public get getSelect() : Select {
    return this._select;
  }
  
  public set setSelect(v : Select) {
    this._select = v;

  }

  // ExtraCols get, set
  public get getExtraCols() :  Array<ExtraCols> {
    return this._extraCols;
  }

  public set setExtraCols(v :  Array<ExtraCols>) {
    this._extraCols = v;
  }

  
  public get getArrDispColsAll() : Array<any> {
    return this._createAllDispCols();
  }

  
  public get getArrColsAll() : Array<any> {
    return this._createAllCols();
  }
  
  
  
  
  
  

  /**
   * @param arr Filtered data.
   * @param arrCopy Original data.
   * @param arrCols Column data.
   * @param arrDispCols Column list.
   * @param ds DataSource.
   * @param count Rows to show.
   * @param empty Has data.
   * @param search Quick search.
   */
  constructor(arr?: any[],
    arrCopy?: any[],
    arrCols?: any[],
    arrDispCols?: any[],
    ds?: any,
    count?: number,
    empty?: boolean,
    search?: any) {

    this.search = search ? search : null;
    this.count = count ? count : 30;
    this.empty = empty ? empty : (this.arr ? (this.arr.length > 0 ? false : true) : null);
    this.arr = arr ? arr : null;
    this.arrCopy = arrCopy ? arrCopy : null;
    this.arrCols = arrCols ? arrCols : null;
    this.ds = ds ? ds : null;
    this.arrDispCols = arrDispCols ? arrDispCols :
      (arrCols ? arrCols.map(data => { return data.name }) : null);
    this._tmSelected = {};

    this.arrSelected = [];
  }

  /**
   * Filters based on the selected values for one column from a dropdown list.
   * @param arrSelected Selected conditions.
   */
  tmSelect(arrSelected: Array<string>, column: string) {
    // this._tmSelected.arrSelected = arrSelected ?? this._tmSelected?.arrSelected;
    // this._tmSelected.column = column ?? this._tmSelected?.column;
    this._tmSelected[column] = arrSelected;
    this._completeSearch('ts');
  }

  /**
   * Quick search only performs search for one give column.
   * @param searchV Search value and current column.
   */
  quickSearch(searchV: string) {
    this._qsValue = searchV ?? this._qsValue;
    this._completeSearch('qs');

  }

  /**
   * Column header input search.
   * @param colSearch Search object. 
   */
  columnSearch(colSearch?: any) {
    this._objColSearch = colSearch ?? this._objColSearch;
    this._completeSearch('cs');
  }

  /**
   * Advanced search filters the data based on multiple conditions.
   * @param searchArr What to search for in which column.
   */
  advancedSearch(searchArr: Array<any>) {
    this._asArr = searchArr ?? this._asArr;
    this._completeSearch('as');
  }

  /**
   * Refresh data and/or filters.
   * @param newData New data.
   * @param filter Apply filters.
   */
  refresh(newData?: Array<any>, filter = true) {

    if (newData) {
      this.arrCopy = newData;
      this.arrSelected = [];
    }

    if (filter) {
      this._completeSearch();
    }
  }

  /**
   * Clears filter values.
   */
  clearFilters() {
    this._tmSelected = {};
    this._asArr = null;
    this._objColSearch = null;
    this._qsValue = null;
  }

  /**
   * Set data source manually
   * @param c Count.
   */
  setDataSource(s?: MatSort, c?: number) {
    this.count = c ? c : this.count;
    this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
    this._sort = s ? s : this._sort;
    this.ds.sort = this._sort;
  }

  /**
   * Set sort for the MatTableDataSource.
   * @param s Material Sort.
   */
  setSort(s?: MatSort) {
    console.log(s);
    this._sort = s ? s : this._sort;
    if (this.ds) {
      this.ds.sort = this._sort;
    }
  }

  setCols(arrCols: Array<any>) {
    this.arrCols = arrCols;
    this.arrDispCols = arrCols.map(data => { return data.name });
  }

  clearSelected() {
    this.arrSelected = [];
  }

  addSelected(item: any, multi: boolean) {


    const i = this.arrSelected.indexOf(item);

    if(multi) {
      if (i < 0 && this.arrSelected.length === 0) {
        this.arrSelected.push(item);
      } else {
        if ( this.arrSelected.length > 0 && i < 0) {
          this.arrSelected.push(item);
        } else {
          
          this.arrSelected.splice(i,1);
        }
      }
    } else {
      if (this.arrSelected.length === 0) {
        this.arrSelected.push(item);
      } else {
        if (i < 0) {
          for (let j = 0; j < this.arr.length; j++) {
            const e = this.arr[j];
            if (e != this.arrSelected[i]) {
              e.select = false;
            }
          }
        } else {
          this.arrSelected.pop();
        }
      }
    }

   
  }

  setArrSelected(arrSelected: Array<any>) {
    this.arrSelected = arrSelected;
  }


  private _createAllDispCols(): Array<any> {
    const adc = this.arrDispCols;
    const s = this._select;
    const ec = this._extraCols;

    this._arrDispColsAll = [];

    if (s) {
      this._arrDispColsAll.push(s.type);
    }

    this._arrDispColsAll = this._arrDispColsAll.concat(adc);

    if (ec) {
      const ect = this._extraCols.map(data => {return data.type});
      this._arrDispColsAll = this._arrDispColsAll.concat(ect);
    }

    return this._arrDispColsAll;
  }

  private _createAllCols(): Array<any> {

    const ac = this.arrCols;
    const s = this._select;
    const ec = this._extraCols;

    this._arrColsAll = [];

    if (s) {
      this._arrColsAll.push(s);
    }

    this._arrColsAll = this._arrColsAll.concat(ac);

    if (ec) {
      this._arrColsAll = this._arrColsAll.concat(ec);
    }

    this._arrColsAll = this._arrColsAll.concat()

    return this._arrColsAll;
  }





  // PRIVATE METHODS ********************************************************************

  private _qs(atf: Array<any>) {

    // Array filtered quick search
    let afQs = [];

    // QUICK SEARCH
    if (this._qsValue === undefined || this._qsValue === '') {
      return atf;
    } else {
      let arrSearched = atf;

      arrSearched = atf.filter(szall => {
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

      afQs = arrSearched;

      /*if (this.arr.length === 0) {
        this.empty = true;
      } else {
        this.count = 30;
        this.empty = false;
      }*/

      return afQs;
    }
    // QUICK SEARCH
  }

  private _cs(atf: Array<any>) {

    let afCs = [];

    const arrCols = [];
    for (const i in this._objColSearch) {
      arrCols.push({
        search_value: this._objColSearch[i],
        name: i
      });
    }

    const arrColsNotNull = arrCols.filter(col => {
      if (!(col.search_value === undefined || col.search_value === '')) {
        return col;
      }
    });

    const emptySearch = (arrColsNotNull.length === 0) ? true : false;

    if (!emptySearch) {
      afCs = atf.filter(szall => {
        let includes = true;
        let result;
        arrColsNotNull.forEach(col => {
          const operator = col.search_value ? col.search_value.toString().toLocaleLowerCase().charAt(0) : null;
          switch (operator) {
            case '>':
              if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
                .toLocaleLowerCase()) > Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()))) {
                includes = false;
              }
              break;
            case '<':
              if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
                .toLocaleLowerCase()) < Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()))) {
                includes = false;
              }
              break;
            default:
              if ((szall[`${col.name}`]) && !(szall[`${col.name}`].toString()
                .toLocaleLowerCase().includes(col.search_value.toString().toLocaleLowerCase()))) {
                includes = false;
              }
              break;
          }

        });

        if (includes) {
          arrColsNotNull.forEach(element => {
            if (!(szall[`${element.name}`] === undefined || szall[`${element.name}`] === '')) {
              result = szall;
            }
          });
          return result;
        }

      });

      return afCs;
    } else {
      return atf;
    }

  }

  private _ts(atf: Array<any>) {

    // Array filtered tm select
    let afTs = atf;


    for (const key in this._tmSelected) {
      if (this._tmSelected.hasOwnProperty(key)) {
        const e = this._tmSelected[key];
        
        if (!this._tmSelected || this._tmSelected[key]?.length === 0) {
          continue;
        } else {
          afTs = afTs.filter(data =>
            this._tmSelected[key].includes(data[key])
          );
          
        }

      }
    }

    return afTs;

    /*
    if (!this._tmSelected.arrSelected || this._tmSelected.arrSelected?.length === 0) {
      return atf;
    } else {
      afTs = atf.filter(data =>
        this._tmSelected.arrSelected.includes(data[`${this._tmSelected.column}`])
      );
      return afTs;
    }*/
  }


  private _as(atf: Array<any>) {

    if (!this._asArr) {
      return atf;
    } else {
      const arrColsNotNull = this._asArr.filter(col => {
        if (!(col.search_value === undefined || col.search_value === '')) {
          return col;
        }
      });

      const emptySearch = (arrColsNotNull.length === 0) ? true : false;

      if (!emptySearch) {
        const arrFiltered = atf.filter(szall => {
          let includes = true;
          let result;
          arrColsNotNull.forEach(col => {
            const operator = col.search_value ? col.search_value.toString().toLocaleLowerCase().charAt(0) : null;
            switch (operator) {
              case '>':
                if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
                  .toLocaleLowerCase()) > Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()))) {
                  includes = false;
                }
                break;
              case '<':
                if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
                  .toLocaleLowerCase()) < Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()))) {
                  includes = false;
                }
                break;
              default:
                if ((szall[`${col.name}`]) && !(szall[`${col.name}`].toString()
                  .toLocaleLowerCase().includes(col.search_value.toString().toLocaleLowerCase()))) {
                  includes = false;
                }
                break;
            }
          });

          if (includes) {
            arrColsNotNull.forEach(element => {
              if (!(szall[`${element.name}`] === undefined || szall[`${element.name}`] === '')) {
                result = szall;
              }
            });
            return result;
          }

        });

        return arrFiltered;

      } else {
        return atf;
      }
    }

  }


  private _completeSearch(fn?: string) {

    // IF ALL SEARCH CONDITIONS ARE NULL OR UNDEFINED
    if (
      !this._tmSelected &&
      !this._objColSearch &&
      !this._qsValue &&
      !this._tmSelected
    ) {
      this.arr = this.arrCopy;
      this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
      this.ds.sort = this._sort;
    } else {

      switch (fn) {
        case 'as':
          this.arr = this._as(this._cs(this._ts(this._qs(this.arrCopy))));
          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;
        case 'cs':
          this.arr = this._cs(this._as(this._ts(this._qs(this.arrCopy))));
          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;
        case 'qs':
          this.arr = this._qs(this._as(this._cs(this._ts(this.arrCopy))));

          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;
        case 'ts':
          this.arr = this._ts(this._as(this._cs(this._qs(this.arrCopy))));
          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;

        default:
          this.arr = this._as(this._cs(this._ts(this._qs(this.arrCopy))));
          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;
      }

      this.empty = this.arr.length > 0 ? false : true;

    }


  }








}
