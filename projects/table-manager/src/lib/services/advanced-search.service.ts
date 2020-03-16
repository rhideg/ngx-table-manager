import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {

  constructor() {
  }

  /**
   * Advanced search on given data.
   * @param arrFilters Array with search req. and columns.
   * @param arrToFilter Array to sort.
   */
  searchCols(arrFilters, arrToFilter) {

    const arrColsNotNull = arrFilters.filter(col => {
      if (!(col.search_value === undefined || col.search_value === '' )) {
        return col;
      }
    });

    const emptySearch = (arrColsNotNull.length === 0) ? true : false;

    if (!emptySearch) {
      const arrFiltered = arrToFilter.filter(szall => {
        let includes = true;
        let eredmeny;
        arrColsNotNull.forEach(col => {
          const operator = col.search_value ? col.search_value.toString().toLocaleLowerCase().charAt(0) : null;
          switch (operator) {
            case '>':
              if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
              .toLocaleLowerCase()) > Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()) )) {
                includes = false;
              }
              break;
            case '<':
              if ((szall[`${col.name}`]) && !(Number(szall[`${col.name}`].toString()
              .toLocaleLowerCase()) < Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()) )) {
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
          /*
          const operator = col.search_value ? col.search_value.toString().toLocaleLowerCase().charAt(0) : null;
          let data;
          let searchValue;

          switch (col.format) {
            case 'number':
                data = szall[`${col.name}`] ? Number(szall[`${col.name}`].toString().toLocaleLowerCase()) : null;
                searchValue = col.search_value ? Number(col.search_value.toString().toLocaleLowerCase().slice(1).trim()) : null;
                break;
            case 'date':
                data = szall[`${col.name}`] ? new Date(szall[`${col.name}`].toString().toLocaleLowerCase()) : null;
                searchValue = col.search_value ? new Date(col.search_value.toString().toLocaleLowerCase().slice(1).trim()) : null;
                break;
            default:
                data = szall[`${col.name}`] ? szall[`${col.name}`].toString().toLocaleLowerCase() : null;
                searchValue = col.search_value ? col.search_value.toString().toLocaleLowerCase().slice(1).trim() : null;
                break;
          }

          switch (operator) {
            case '>':
              console.log(2);
              if ((szall[`${col.name}`]) && !(data > searchValue)) {
                includes = false;
              }
              break;
            case '<':
              console.log(3);
              if ((szall[`${col.name}`]) && !(data < searchValue )) {
                includes = false;
              }
              break;
            default:
              console.log(4);
              if ((szall[`${col.name}`]) && !(data.includes(searchValue))) {
                includes = false;
              }
              break;
          }
          */
        });

        if (includes) {
          arrColsNotNull.forEach(element => {
            if (!(szall[`${element.name}`] === undefined || szall[`${element.name}`] === '')) {
              eredmeny = szall;
            }
          });
          return eredmeny;
        }

      });

      return arrFiltered;

    } else {
      return arrToFilter;
    }
  }
}
