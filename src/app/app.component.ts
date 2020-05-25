import { Component, OnInit} from '@angular/core';
import { TableSort } from 'projects/table-manager/src/lib/models/table-sort';
import { TestCols } from '../app/models/table-cols/test.json';
import { DATA } from './models/datat';
import { TableManagerService } from 'projects/table-manager/src/public-api';

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
  loading = true;

  constructor(
    private tmService: TableManagerService
  ) {
    // Get displayed columns from our json.
    const a = TestCols.map(data => {
      return data.name;
    });

    // Set members.
    const search = {title: 'Name', name: 'name', show: true, sticky: false };
    this.tsTest = new TableSort(
      null,
      null,
      TestCols,
      a,
      null,
      30,
      false,
      search
    );

    console.log(this.tsTest);
    

    this.extraCols = [
      {
        type: 'btnEdit',
        icon: 'edit',
        filter: [{ col: 'name', value: ['test1', 'test3'], relation: '===' }],
        tooltip: 'Edit'
      },
      {
        type: 'del',
        icon: 'delete',
        style: {
          color: '#FF6859'
        },
        tooltip: 'Delete'
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
    this.loading = false;
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

  // Toggle selectable
  btnToggle() {
    this.isSelectable = {
      type: 'select',
      multi: true,
      filter: [{ col: 'type', value: ['a', 'b'], relation: '===' }, { col: 'id', value: [5], relation: '>' }],
    };
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

    this.tsTest.arr = JSON.parse(JSON.stringify(DATA));
    //this.tsTest.arrCopy = JSON.parse(JSON.stringify(DATA));
    //this.tsTest.ds = JSON.parse(JSON.stringify(DATA));
    //this.tsTest.search = JSON.parse(JSON.stringify(this.tsTest.search));

    //this.tmService.setTs(this.tsTest);

    /*this.tsTest = new TableSort(
      this.tsTest
    );*/
    
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
