import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Search } from './search';
import { Select } from './select';
import { ExtraCols } from './extra-cols';

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

  private _search: any;
  private _localSearch: boolean = false;


  // Select get, set
  public get getSelect(): Select { return this._select; }
  public set setSelect(v: Select) { this._select = v; }

  // ExtraCols get, set
  public get getExtraCols(): Array<ExtraCols> { return this._extraCols; }
  public set setExtraCols(v: Array<ExtraCols>) { this._extraCols = v; }

  public get getArrDispColsAll(): Array<any> { return this._createAllDispCols(); }
  public get getArrColsAll(): Array<any> { return this._createAllCols(); }

  // Search object get set
  public get getSearch(): any { return this._search; }

  // Return advanced search array
  public get getAsArr(): Array<any> { return this._asArr; }

  // Get set localsearch
  public get getLocalSearch(): boolean { return this._localSearch; }
  public set setLocalSearch(v: boolean) { this._localSearch = v; }






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
    this.arrCols = arrCols ? arrCols : this._createCols();
    this.ds = ds ? ds : null;
    this.arrDispCols = arrDispCols ? arrDispCols :
      (arrCols ? arrCols.map(data => { return data.name }) : null);
    this._tmSelected = {};

    this.arrSelected = [];
    this._search = {};
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

    if (!this.arrCols) {
      this._createCols(newData);
    }

    if (newData) {
      this.arrCopy = newData;
      this.arrSelected = [];
    }

    if (filter) {
      this._completeSearch();
    }
  }

  /**
   * Add new data to array copy.
   * @param dataSnippet Data snippet, has to be structured as current data
   * @param filter Apply filters.
   */
  extendData(dataSnippet?: Array<any>, filter = true) {
    if (!this.arrCols) {
      this._createCols(dataSnippet);
    }

    if (dataSnippet) {
      this.arrCopy = this.arrCopy.concat(dataSnippet);
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
    this._sort = s ? s : this._sort;
    if (this.ds) {
      this.ds.sort = this._sort;
    }
  }

  /**
   * Set columns.
   * @param arrCols Array of columns. 
   */
  setCols(arrCols: Array<any>) {
    this.arrCols = arrCols;
    this.arrDispCols = arrCols.map(data => { return data.name });
  }

  /**
   * Clear selection.
   */
  clearSelected() {
    this.arrSelected = [];
  }

  /**
   * Add a new item to the selected list based on the type (multi)
   * @param item New selected item.
   * @param multi Multiple select - true/false.
   */
  addSelected(item: any, multi: boolean) {


    const i = this.arrSelected.indexOf(item);

    if (multi) {
      if (i < 0 && this.arrSelected.length === 0) {
        this.arrSelected.push(item);
      } else {
        if (this.arrSelected.length > 0 && i < 0) {
          this.arrSelected.push(item);
        } else {

          this.arrSelected.splice(i, 1);
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

  /**
   * Set the selected items.
   * @param arrSelected Selected items.
   */
  setArrSelected(arrSelected: Array<any>) {
    this.arrSelected = arrSelected;
  }

  // PRIVATE METHODS ********************************************************************

  /**
   * Create columns if it is not provided.
   */
  private _createCols(newData?: any) {

    if (this.arr || newData) {
      const obj = this.arr ? this.arr[0] : newData[0];
      let arrCols = [];

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const e = obj[key];
          let col: any = {};

          col.name = key;
          col.title = key.charAt(0).toUpperCase() + key.slice(1);
          col.show = true;
          col.sticky = false;
          col.search_value = "";
          col.style = {};
          col.format = typeof (e);

          arrCols.push(col);
        }
      }

      this.arrCols = arrCols;
      this.arrDispCols =
        (arrCols ? arrCols.map(data => { return data.name }) : null);
      return arrCols;
    }

  }

  /**
   * Returns an array with all the displayed columns (including the extra columns)
   */
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
      const ect = this._extraCols.map(data => { return data.type });
      this._arrDispColsAll = this._arrDispColsAll.concat(ect);
    }

    return this._arrDispColsAll;
  }


  /**
   * Returns an array with all the columns shown in the table (including the extra columns)
   */
  private _createAllCols(): Array<any> {

    const ac = this.arrCols ? this.arrCols : this._createCols();
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


  /**
   * Quick search function, filters the given array with the current quick search value (this._qsValue)
   * @param atf Array to filter.
   */
  private _qs(atf: Array<any>) {

    // Add quick search to _search object. 
    if (this.search.search_value || this._qsValue) {
      const s = {
        column: this.search.name,
        value: this.search.search_value ? `~${this.search.search_value}` : `~${this._qsValue}`
      };
      this._search[s.column] = s.value;
    };


    if (!this._localSearch) {

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

        return afQs;
      }

    } else {
      return atf;
    }



  }

  /**
   * Filters the given array based on the values written in each column.
   * @param atf Array to filter.
   */
  private _cs(atf: Array<any>) {


    // Add column search to search
    if (this._objColSearch) {
      Object.keys(this._objColSearch).forEach((key, index) => {
        const s = {
          column: key,
          value: this._objColSearch[key]
        }
        this._search[s.column] = s.value;
      });
    }


    if (!this._localSearch) {

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

    } else {
      return atf;
    }

  }

  /**
   * Tm select (table manager select) search. Searches for the values selected in the dropdown. 
   * @param atf Array to filter.
   */
  private _ts(atf: Array<any>) {
    // Add tm select to search
    if (this._tmSelected) {
      Object.keys(this._tmSelected).forEach((key, index) => {
        const s = {
          column: key,
          value: this._tmSelected[key]
        }
        if (this._tmSelected[key].length > 0) {
          this._search[s.column] = `[${s.value.toString()}]`;
        }
      });
    }


    // Array filtered tm select
    if (!this._localSearch) {


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
    } else {
      return atf;
    }
  }


  /**
   * Advanced search, multiple search params apply, search for one or more column.
   * @param atf Array to filter.
   */
  private _as(atf: Array<any>) {

    // Add advanced search to search

    if (this._asArr) {
      for (let i = 0; i < this._asArr.length; i++) {
        const e = this._asArr[i];

        if (e.value) {
          const s = {
            column: e.field,
            value: e.value
          };

          switch (e.operator) {
            case '=':
              s.value = `=${s.value}`;
              break;
            case '>':
              s.value = `>${s.value}`;
              break;
            case '>=':
              s.value = `>=${s.value}`;
              break;
            case '<':
              s.value = `<${s.value}`;
              break;
            case '<=':
              s.value = `<=${s.value}`;
              break;
            case '~':
              s.value = `~${s.value}`;
              break;
            case 'in':
              const divider = e.value.includes(',') ? ','
                : (e.value.includes(';') ? ';'
                  : (e.value.includes(' and ') ? ' and '
                    : (e.value.includes(' ') ? ' ' : null)));

              const arr = e.value.split(divider);

              if (e.value) {
                s.column = e.field;
                s.value = `[${arr.toString()}]`;
              }

              break;
            case 'between':
              const divBetween = e.value.includes(',') ? ','
                : (e.value.includes(';') ? ';'
                  : (e.value.includes(' and ') ? ' and '
                    : (e.value.includes(' ') ? ' ' : null)));

              if (divBetween) {
                const arr = e.value.split(divBetween);
                if (arr) {
                  let a; // smaller
                  let b; // larger
                  if (+arr[0] < +arr[1]) {
                    a = arr[0];
                    b = arr[1];
                  } else {
                    a = arr[1];
                    b = arr[0];
                  }
                  s.column = e.field;
                  s.value = `>${a}<${b}`;
                }
              }
              break;
            default:
              break;
          }
          this._search[s.column] = s.value;
        }
      }
    }

    if (!this._localSearch) {



      // Actual search
      if (!this._asArr || this._asArr.length === 0) {
        return atf;
      } else {

        let arrFiltered = atf;

        for (let i = 0; i < this._asArr.length; i++) {


          arrFiltered = arrFiltered.filter(data => {
            let includes = false;

            const e = this._asArr[i];
            const toCompare = data[e.field];
            const compareWith = e.value;
            const operator = e.operator;

            switch (operator) {
              case '=':
                if (toCompare == compareWith) {
                  includes = true;
                }
                break;
              case '>':
                if (toCompare > compareWith) {
                  includes = true;
                }
                break;
              case '>=':
                if (toCompare >= compareWith) {
                  includes = true;
                }
                break;
              case '<':
                if (toCompare < compareWith) {
                  includes = true;
                }
                break;
              case '<=':
                if (toCompare <= compareWith) {
                  includes = true;
                }
                break;
              case '~':
                if (toCompare.toString().toLocaleLowerCase().includes(compareWith.toString().toLocaleLowerCase())) {
                  includes = true;
                }
                break;
              case 'in':
                const divider = compareWith.includes(',') ? ','
                  : (compareWith.includes(';') ? ';'
                    : (compareWith.includes(' and ') ? ' and '
                      : (compareWith.includes(' ') ? ' ' : null)));
                if (divider) {
                  const arr = compareWith.split(divider);
                  if (arr) {
                    for (let j = 0; j < arr.length; j++) {
                      const f = arr[j];
                      if (f == toCompare) {
                        includes = true;
                        break;
                      }
                    }
                  }
                }
                break;
              case 'between':

                const divBetween = compareWith.includes(',') ? ','
                  : (compareWith.includes(';') ? ';'
                    : (compareWith.includes(' and ') ? ' and '
                      : (compareWith.includes(' ') ? ' ' : null)));

                if (divBetween) {
                  const arr = compareWith.split(divBetween);
                  if (arr) {

                    let a; // smaller
                    let b; // larger
                    if (+arr[0] < +arr[1]) {
                      a = arr[0];
                      b = arr[1];
                    } else {
                      a = arr[1];
                      b = arr[0];
                    }

                    if (toCompare > +a && toCompare < +b) {
                      includes = true;
                    }
                  }
                }
                break;

              default:
                break;
            }

            return includes

          });

        };

        if (arrFiltered) {

          return arrFiltered;
        } else {
          return atf;
        }

      }

    } else {
      return atf;
    }

  }




  /**
   * Searches the dataset with every search function, so multiple filters can be applied. Always the current search 
   * is the dominant. (If we perform a quick search, it's going to be the final search function to filter the dataset.)
   * @param fn Search type. as - Advanced Search, cs - Column Search, qs - Quick Search, ts - tm-select Search
   */
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

      this._search = {};

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
          this.arr = this.arrCopy;
          this.ds = new MatTableDataSource(this.arr.slice(0, this.count));
          this.ds.sort = this._sort;
          break;
      }
      this.empty = this.arr.length > 0 ? false : true;
    }


  }








}
