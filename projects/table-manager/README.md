# Angular Table Manager
👨‍🏫 Try the [demo](https://ngx-table-manager-trylx5.stackblitz.io)!

⚡ Edit on [Stackblitz](https://stackblitz.com/edit/ngx-table-manager-trylx5)!

👨‍🔧 Generate your models [here](https://rhideg.github.io/model-generator/)!

![Imgur](https://imgur.com/5mS0wBh.png)
![Imgur](https://imgur.com/SDVk7V3.png)
![Imgur](https://imgur.com/Ar6M9kN.png)



## Features:
* Quick search
* Advanced search
* Column managing (column order, visibility, sticky on horizontal scroll)
* Sorting
* Customizable button columns (With their own events)
* Selection (multiple and single)
* Easy editing and customization

### Components:
* **ngx-table:** Basic data table.
* **ngx-table-manager:** Table manager, it provides the search and sort fuctions.
* **ngx-tm-select:** Dropdown select filter, for specific calumn with custom or unique data from the column.


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
``` bash
npm i ngx-color-picker
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

  <!-- DROPDOWN FILTER - FOR COLUMN 'TYPE' -->
   <ngx-tm-select
      style="margin: 10px;"

      [input]="tsTest"
      [column]="'type'"
      [name]="'Type'"

      (output)="selectTest($event)"
      >
    </ngx-tm-select> 

    <!-- TABLE MANAGER WITH SEARCH AND ADVANCED SEARCH -->
    <ngx-table-manager
      style="margin: 10px;"

      [input]="tsTest" 
      [selectedColor]="'red'"
      [advencedSearch]="true"
      [fastSearch]="true"
      [displayColumns]="true"
      [inputSearch]="true"
      [startSearch]="true"
      [columnSticky]="true"
      [colorPickerText]="true"
      [colorPickerBackground]="true"

      (output)="onSearchTest($event)"  
      (dispColsSelect)="onDispColsSelect($event)"
      >
      </ngx-table-manager>
  
    <!-- MATERIAL TABLE -->
    <ngx-table
      fxFlex 
      style="height: 100%;"
      
      [input]="tsTest" 
      [isRowSelect]="true"
      [numberFormat]="numberFormat"
      [loading]="loading"
      [rowColor]="true"
      [columnSearch]="true"
      [resizable]="true"

      (output)="onEvent($event)"
      (scroll)="onTableScroll($event)"
    >
    </ngx-table>
```

  

### TypeScript:

``` javascript

import { Component, OnInit } from '@angular/core';
import { TableSort } from 'projects/table-manager/src/lib/models/table-sort';
import { TestCols } from '../app/models/table-cols/test.json';
import { DATA } from './models/datat';
import { TableManagerService, ExtraCols, Select, Relations } from 'projects/table-manager/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // ngx-table, ngx-table-manager
  tsTest: TableSort;

  // ngx-tm-select
  arrSelectTest = [
    { key: 1, value: 'test1' },
    { key: 2, value: 'test2' }
  ];

  // ngx-table
  extraCols = [];
  select;
  isRowSelect;
  numberFormat;
  loading = true;

  arrEc: Array<ExtraCols>;
  s: Select;

  constructor(
    private tmService: TableManagerService
  ) {

    // SET MEMBERS:
    const search = { title: 'Name', name: 'name', show: true, sticky: false };
    this.tsTest = new TableSort(null, null, null, null, null, null, false, search);

    this.tsTest.setSelect = {
      type: 'select',
      multi: true,
      filter: [
        { col: 'type', value: ['a', 'b'], relation: Relations.eq }
      ]
    };

    this.tsTest.setExtraCols = [
      {
        type: 'edit',
        icon: 'edit',
        filter: [
          { col: 'name', value: ['test1', 'test2'], relation: Relations.eq }
        ]
      },
      {
        type: 'del',
        icon: 'delete',
        style: {
          color: '#FF6859'
        },
        tooltip: 'Delete'
      }
    ];

    this.numberFormat = '1.0-2';
    this.isRowSelect = true;
  }

  /**
   * Call load data on init. Simulate API request.
   */
  ngOnInit() {

    setTimeout(() => {
      this.loadData();

    }, 3000);
  }

  /**
   * Get data from local DATA. (replace this with your request.)
   */
  loadData() {
    this.tsTest.refresh(JSON.parse(JSON.stringify(DATA)));
    this.loading = false;
  }

  /**
   * Set tsTest to search result.
   * @param searchObj Search result.
   */
  onSearchTest(searchObj: TableSort) {
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
  }

  // Toggle selectable
  btnToggle() {

    if (this.tsTest.getSelect) {
      this.tsTest.setSelect = null;
    } else {
      this.tsTest.setSelect = {
        type: 'select',
        multi: true,
        filter: [{ col: 'type', value: ['a', 'b'], relation: Relations.eq }, { col: 'id', value: [5], relation: Relations.gt }],
      };
    }
  }

  // Refresh data
  btnRefresh_Click() {
    DATA.push({
      id: 200,
      name: 'test101',
      number: 33333,
      text: 'ewwqrwq',
      type: 'i'
    });

    this.tsTest.refresh(JSON.parse(JSON.stringify(DATA)));
  }

  /**
   * Close column select dialog.
   * @param event Returns the cols. data.
   */
  onDispColsSelect(event) {
    console.log(event);
    this.tsTest.arrCols = event;
  }

  onTableScroll(event) {
    console.log(event);
  }


}

```

* You can generate your column model with our model generator or you can leave it as null and the table manager class will generate it for you!  

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
            "style": {},
            "format": "number"
        },
        {
            "title": "Name",
            "name": "name",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": {},
            "format": "string"
        },
        {
            "title": "Type",
            "name": "type",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": {},
            "format": "string"
        },
        {
            "title": "Text",
            "name": "text",
            "show": true,
            "sticky": false,
            "search_value": "",
            "style": {},
            "format": "string"
        }
    ]
}
