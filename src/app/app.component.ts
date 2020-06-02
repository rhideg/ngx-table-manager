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
    this.tsTest = new TableSort(null, null, TestCols, null, null, null, false, search);

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
}
