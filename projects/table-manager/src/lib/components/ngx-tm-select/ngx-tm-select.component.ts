import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { TableSort } from '../../models/table-sort';

@Component({
  selector: 'ngx-tm-select',
  templateUrl: './ngx-tm-select.component.html',
  styleUrls: ['./ngx-tm-select.component.scss']
})
export class NgxTmSelectComponent implements OnChanges {

  arrSelected = [];

  @Input() input: TableSort; // required
  @Input() arrSelect: any[];  // optional
  @Input() column: string; // required
  @Input() name: string;

  @Output() output = new EventEmitter<TableSort>(); // returns sorted ts
  constructor() {
  }

  ngOnChanges(): void {
    // arrSelect: null, column: null -> 0
    // arrSelect: <>, column: null -> 0
    // arrSelect: null, column: <> -> ts.arrCopy.unique
    // arrSelect: <>, column: <> -> arrSelect = arrSelect
    (async () => {
      while (!this.input.ds) { // define the condition as you like
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      if (this.input.arrCopy) {
        if (!this.column) {
          //console.log('Error!');
        } else {
          if (!this.arrSelect) {
            const arrCols = [...new Set(this.input.arrCopy.map(a => a[`${this.column}`]))];
            this.arrSelect = this.arrToObjArr(arrCols);
          } else {
            this.arrSelect = this.arrToObjArr(this.arrSelect);
          }
        }
      }
    })();
  }

  /**
   * Select option from mat select and trigger output.
   * @param event selectionChange event.
   */
  selectOption(event) {
    this.arrSelected = event.value;
    console.log(this.arrSelected);

    if (this.arrSelected.length === 0) {
      this.input.arr = this.input.arrCopy;
    } else {
      this.input.arr = this.input.arrCopy.filter(data =>
        this.arrSelected.includes(data[`${this.column}`])
      );
    }

    this.output.emit(this.input);
  }


  /**
   * Converts array to array of {key: <>, value: <>} objects.
   * @param arr Array to convert.
   */
  arrToObjArr(arr) {
    let arrObj;

    if (!arr[0].key) {
      arrObj = arr.map(data =>
        data = { key: data, value: data }
      );
    } else {
      arrObj = arr;
    }

    return arrObj;
  }

}
