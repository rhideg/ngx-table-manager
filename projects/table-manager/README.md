# Angular Table Manager
⚡ Try it on [Stackblitz](https://stackblitz.com/edit/ngx-table-manager)!
👨‍🔧 Generate your models [NOW](https://rhideg.github.io/model-generator/)!

![Image of Stackblitz](https://imgur.com/8aYyLNm.png)

## Have you ever found yourself
* creating complicated data tables with lots and lots of columns,
* implementing the same features like search, sort, filter, select etc. over and over again,
* looking at a 100+ lines long HTML template of a component and wondering *"Why do I have to write all this, when my component only contains a single table?"*,
* copy-pasting the same solution for a feature to a lot of similar components?

If your answer is **'Yes!'** then you are at the right place. We created a reusable Angular Table Manager (based on Angular's [mat-table]([https://material.angular.io/components/table/overview)) to solve all of these issues.

With the [simple model generator](https://rhideg.github.io/model-generator/) it takes only a minute to create a complex data table (with search, filter, sort and all the other provided features) from a single **JSON**.

## Features:
* Quick search
* Advanced search
* Column managing (Order of the columns, visibility, sticky on horizontal scroll)
* Sorting
* Customizable button columns (With their own events)
* Selection (multiple and single)
* Easy editing and customization

### Components:
* **ngx-table:** The basic data table
* **ngx-table-manager:** Table manager, it provides the search and sor fuctions
* **ngx-tm-select:** Basic dropdown select and sort


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

    // Optional (default: undefined)
    [extraCols]="extraCols"
    [isSelectable]="isSelectable"
    [isRowSelect]="isRowSelect"
    [numberFormat]="numberFormat"
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
  extraCols = []; //Optional extra buttons (default is undefined)
  isSelectable; //Optional checkbox (default is undefined)
  isRowSelect; // Optional row select (default is undefined)
  numberFormat; // Optional format of number type columns (default is undefined)

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
        icon: 'edit',
        // filter btn where condition. Realtions can be from [ '===', '!==', '<', '<=', '>', '>=' ].
        filter: [{ col: 'name', value: ['test1'], relation: '===' }],
      },
      {
        type: 'del',
        icon: 'delete',
        style: {
          color: '#FF6859'
        },
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

    this.isSelectable = {
      type: 'select',
      multi: true,
      // filter checkbox where condition. Realtions can be from [ '===', '!==', '<', '<=', '>', '>=' ].
      filter: [{ col: 'type', value: ['a', 'b'], relation: '===' }, { col: 'id', value: [2], relation: '>' }],
    };
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
