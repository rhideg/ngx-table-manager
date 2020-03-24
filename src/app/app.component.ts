import { Component, OnInit } from '@angular/core';
import { TableSort } from 'projects/table-manager/src/lib/models/table-sort';
import { TestCols } from '../app/models/table-cols/test.json';
import { DATA } from './models/datat';

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
  isSelectable;
  isRowSelect;
  numberFormat;

  constructor(
  ) {
    // Get displayed columns from our json.
    const a = TestCols.map(data => {
      return data.name;
    });

    // Set members.
    this.tsTest = {
      arr: null,
      arrCopy: null,
      arrCols: TestCols,
      arrDispCols: a,
      ds: null,
      count: 30,
      empty: true,
      search: { title: 'Name', name: 'name', show: true, sticky: false }
    };

    this.extraCols = [
      {
        type: 'btnEdit',
        icon: 'edit',
        filter: [{ col: 'name', value: ['test1', 'test3'], relation: '===' }],
      },
      {
        type: 'del',
        icon: 'delete',
        style: {
          color: '#FF6859'
        },
      },
    ];

    this.numberFormat = '1.0-2';

    this.isRowSelect = true;

    this.isSelectable = {
      type: 'select',
      multi: true,
      filter: [{ col: 'type', value: ['a', 'b'], relation: '===' }, { col: 'id', value: [5], relation: '>' }],
    };
  }

  /**
   * Call load data on init.
   */
  ngOnInit() {
    setTimeout(() => {
      this.loadData();
    }, 2000);
  }

  /**
   * Get data from local DATA. (replace this with your request.)
   */
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
    console.log(searchObj);
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
