
# Angular Table Manager

⚡ Try it on Stackblitz: https://stackblitz.com/edit/angular-6zrdhd?file=src%2Fapp%2Fapp.component.ts

👨‍🔧 Generate your models now: https://rhideg.github.io/model-generator/

![Image of Stackblitz](https://imgur.com/8aYyLNm.png)

# Getting started

## Installation:

Install via npm package manager

```npm i ngx-table-manager```

### Prerequisites:
``` bash
npm i -s @angular/flex-layout
  ```
 ``` bash
ng add @angular/material
  ```
  

  

## Usage:

  

### Module:

Import ```ngx-table-manager```

``` javascript

import { TableManagerModule } from  'ngx-table-manager';
@NgModule({

imports: [ TableManagerModule ]
})

```

  

### HTML:

Add  ```ngx-table-manager```

``` html

  <ngx-tm-select
      [input]="tsTest"
      [column]="'id'"
      [name]="'TEST'"
      [arrSelect]="arrSelectTest"
      (output)="selectTest($event)"
      >
  </ngx-tm-select>

  <ngx-table-manager
      [input]="tsTest" 
      (output)="onSearchTest($event)"  
      [selectedColor]="'red'"
      (dispColsSelect)="onDispColsSelect($event)" // Returns names where show is true

      
      // Optional (default: true)
      [advencedSearch]="true"
      [fastSearch]="true"
      [displayColumns]="true"
      [inputSearch]="true"
      [startSearch]="true"

      >
  </ngx-table-manager>

  <ngx-table 
    [input]="tsTest" 
    [extraCols]="extraCols"
    [isSelectable]="isSelectable"
    (output)="onEvent($event)"
    >
  </ngx-table>
```

  

### TypeScript:

``` javascript

import { Component, OnInit } from '@angular/core';
import { TableSort } from 'projects/table-manager/src/lib/models/table-sort';
import { colsTest, displayedColumnsTest } from './models/test-cols';
import { DATA } from './models/datat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'table-management';

  // ngx-table, ngx-table-manager
  tsTest: TableSort;

  // ngx-table
  extraCols = [];
  isSelectable;

  // ngx-tm-select
  arrSelectTest = [
    { key: 1, value: 'test1' },
    { key: 2, value: 'test2' }
  ];

  constructor() {
    // Get displayed columns from our json.
    const a = TestCols.map(data => {
      return data.name;
    });

    this.tsTest = {
      arr: null,
      arrCopy: null,
      arrCols: JSON.parse(JSON.stringify(colsTest)),
      arrDispCols: JSON.parse(JSON.stringify(displayedColumnsTest)),
      ds: null,
      count: 30,
      empty: false,
      search: { title: 'NAME', name: 'name', show: true, sticky: false }
    };

    // extra buttons to show.
    this.extraCols = [
      {
        type: 'btnEdit',
        icon: 'search',
      },
      {
        type: 'del',
        icon: 'delete',
        style: {
          color: '#FF6859'
        }
      },
      {
        type: 'btnDownload',
        icon: 'pets',
      },
      {
        type: 'btnPrint',
        icon: '4k',
      }
    ];
    // checkbox option. 1 Single select, 2 multiple select, else hidden.
    this.isSelectable = 2;
  }

  /**
   * Call load data on init.
   */
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.tsTest.arr = JSON.parse(JSON.stringify(DATA));
    this.tsTest.arrCopy = JSON.parse(JSON.stringify(DATA));
    this.tsTest.ds = JSON.parse(JSON.stringify(DATA));
  }

  /**
   * Set tsTest to search result.
   * @param searchObj Search result.
   */
  onSearchTest(searchObj: TableSort) {
    this.tsTest = new TableSort(searchObj);
  }

  /**
   * Output event.
   * @param event edit, del, select, selectAll.
   */
  onEvent(event) {
    console.log(event);
  }

  /**
   * ngx-tm-select selection change.
   * @param selectObj Search result.
   */
  selectTest(selectObj: TableSort) {
    this.tsTest = new TableSort(selectObj);
  }

  /**
   * Close column select dialog.
   * @param event Returns the cols. data.
   */
  onDispColsSelect(event) {
    const a = event.map(data => {
      return data.name;
    });
    this.tsTest.arrDispCols = a;
    this.tsTest = new TableSort(this.tsTest);
  }

}

```

  

## Models:

### TableSort:

``` javascript

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

```

  

### Columns:

``` tableCols.json

{
    "TestCols": [
        {
            "title": "Id",
            "name": "id",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": "",
            "format": "number"
        },
        {
            "title": "Name",
            "name": "name",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": "",
            "format": "string"
        },
        {
            "title": "Type",
            "name": "type",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": "",
            "format": "string"
        },
        {
            "title": "Text",
            "name": "text",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": "",
            "format": "string"
        }
    ]
}
