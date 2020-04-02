import {
  Component, ContentChild, EventEmitter, Input,
  OnChanges, Output, TemplateRef, ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { TableSort } from '../../models/table-sort';

@Component({
  selector: 'ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.scss']
})
export class NgxTableComponent implements OnChanges {

  arrSelected = [];
  arrCopy = [];
  selectAll;
  btnDoEvent = true;

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @Input() input: TableSort; // Contains the metadata
  @Input() extraCols; // Contains extra columns(buttons)
  @Input() isRowSelect; // If true then row selected.
  @Input() numberFormat; // Number format.
  @Input() isSelectable; // Single select when multi value is false, multi select if value true.
  @Output() output = new EventEmitter<any>(); // returns element

  @ViewChild('sortTest', { static: false }) sortTest: MatSort; // Material table sort
  constructor(
    public dialog: MatDialog,
  ) { }

  /**
   * Listen for changes and set input.
   * @param changes Change.
   */
  ngOnChanges(changes): void {
    (async () => {
      while (!this.input.ds) { // define the condition as you like
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!this.objectArraysAreEquivalent(this.arrCopy, changes.input.currentValue.arrCopy)) {
        this.arrSelected = [];
      }

      this.input = changes.input.currentValue;
      this.arrCopy = this.input.arrCopy;

      if (!this.isRowSelect) {
        this.isRowSelect = false;
      }

      if (this.isSelectable && !this.input.arrDispCols.includes(this.isSelectable.type)) {
        this.input.arrDispCols.unshift(this.isSelectable.type);
      }

      if (this.extraCols) {
        this.extraCols.forEach(element => {
          if (!this.input.arrDispCols.includes(element.type)) {
            this.input.arrDispCols.push(element.type);
          }
        });
      }

      if (this.input.count >= 30) {
        this.input.count = 30;
      }

      this.arrSelected.forEach(selectedItem => {
        const tmpSelectedItem = JSON.parse(JSON.stringify(selectedItem));
        delete tmpSelectedItem.select;
        const itemIndex = this.input.arr.findIndex(a => (this.objectsAreEquivalent(a, tmpSelectedItem)));
        if (itemIndex !== -1) {
          this.input.arr[itemIndex].select = true;
        }
      });

      if (this.input.arr === null) {
        this.input.arr = [];
        this.selectAll = false;
      }

      this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
      this.input.ds.sort = this.sortTest;

      if (this.isSelectable) {
        const arrTmp = this.input.arr.filter(item => this.checkFilter(item, this.isSelectable));
        if (arrTmp.every(item => item.select) && arrTmp.length !== 0) {
          let withoutSelect = true;
          for (var i = 0; i < arrTmp.length; i++) {
            if (arrTmp[i].select) {
              withoutSelect = false;
              break;
            }
          }
          if (withoutSelect) {
            this.selectAll = false;
          } else {
            this.selectAll = true;
          }
        } else if (!arrTmp.every(item => item.select) || arrTmp.length === 0) {
          this.selectAll = false;
        }
      }
    })();
  }

  checkFilter(element, item) {
    let ret = false;
    if (item.filter) {
      const arrRet = [];
      item.filter.forEach(filterElement => {
        switch (filterElement.relation) {
          case '===':
            filterElement.value.forEach(valueElement => {
              if ((element[filterElement.col] === valueElement)) {
                arrRet.push(false);
              }
            });
            break;
          case '!==':
            filterElement.value.forEach(valueElement => {
              if (!(element[filterElement.col] !== valueElement)) {
                arrRet.push(false);
              }
            });
            break;
          case '<':
            if (!(element[filterElement.col] <= filterElement.value[0])) {
              arrRet.push(false);
            }
            break;
          case '<=':
            if (!(element[filterElement.col] < filterElement.value[0])) {
              arrRet.push(false);
            }
            break;
          case '>':
            if (!(element[filterElement.col] >= filterElement.value[0])) {
              arrRet.push(false);
            }
            break;
          case '>=':
            if (!(element[filterElement.col] > filterElement.value[0])) {
              arrRet.push(false);
            }
            break;
        }
      });
      ret = true ? (arrRet.includes(false) && item.filter.length === arrRet.length) : ret = false;
      return ret;
    } else {
      return true;
    }
  }

  /**
   * Compare two object arrays. Returned true if so, else false.
   * @param a First array.
   * @param b Second array.
   */
  objectArraysAreEquivalent(a, b) {
    if (!a || !b) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (!this.objectsAreEquivalent(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Compare two objects. Returned true if so, else false.
   * @param a First object.
   * @param b Second object.
   */
  objectsAreEquivalent(a, b) {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    const index = aProps.indexOf('select', 0);
    const index2 = bProps.indexOf('select', 0);
    if (index > -1) {
      aProps.splice(index, 1);
    }
    if (index2 > -1) {
      bProps.splice(index2, 1);
    }

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  scrollTable(event) {
    const tableViewHeight = event.target.offsetHeight;
    const tableScrollHeight = event.target.scrollHeight;
    const scrollLocation = event.target.scrollTop;
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      this.input.count += 20;
      this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
      this.input.ds.sort = this.sortTest;
    }
  }

  rowSelected(element) {
    setTimeout(() => {
      if (this.btnDoEvent) {
        this.output.emit({
          type: 'rowSelected',
          data: element
        });
      }
    }, 10);
  }

  btnCustom(element, item) {
    this.btnDoEvent = false;
    setTimeout(() => {
      if (item.type === 'del') {
        const title = 'Warning';
        const message = 'Are you sure to delete this row?';
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          height: '30vh',
          width: '30vw',
          minHeight: '200px',
          minWidth: '300px',
          data: {
            title,
            message
          }
        });

        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            this.output.emit({
              type: item.type,
              data: element
            });

            this.btnDoEvent = true;
          } else {
            this.btnDoEvent = true;
          }
        });
      } else {
        this.output.emit({
          type: item.type,
          data: element
        });

        this.btnDoEvent = true;
      }
    }, 20);
  }

  /**
   * Select all.
   */
  async chboxAll_select() {
    this.btnDoEvent = false;
    const arrTmp = this.input.arr.filter(item => this.checkFilter(item, this.isSelectable));
    if (this.input.arr.length === this.input.arrCopy.length) {
      if (!arrTmp.every(item => item.select)) {
        this.arrSelected = [];
        this.selectAll = true;
        arrTmp.forEach(element => {
          element.select = true;
          this.arrSelected.push(element);
        });
      } else {
        this.selectAll = false;
        arrTmp.forEach(element => {
          element.select = false;
          this.arrSelected = [];
        });
      }
    } else {
      if (this.arrSelected.length !== 0) {
        if (!arrTmp.every(item => item.select)) {
          arrTmp.forEach(element => {
            if (!element.select) {
              element.select = true;
              this.arrSelected.push(element);
            }
          });
          this.selectAll = true;
        } else {
          arrTmp.forEach(element => {
            const foundIndex = this.arrSelected.findIndex(item => this.objectsAreEquivalent(element, item));
            element.select = false;
            if (foundIndex !== -1) {
              this.arrSelected.splice(foundIndex, 1);
            }
          });
          this.selectAll = false;
        }
      } else {
        if (!arrTmp.every(item => item.select)) {
          this.arrSelected = [];
          this.selectAll = true;
          arrTmp.forEach(element => {
            element.select = true;
            this.arrSelected.push(element);
          });
        }
      }
    }

    const indexes = [];
    arrTmp.map(element => {
      const foundIndex = this.input.arr.findIndex(item => this.objectsAreEquivalent(element, item));
      if (foundIndex !== -1) {
        if (element.select) {
          indexes.push(foundIndex);
        }
      }
    });

    indexes.map(item => {
      this.input.arr[item].select = true;
    });
    this.input.arr.filter(element => !element.select).map(item => item.select = false);

    this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
    this.input.ds.sort = this.sortTest;

    this.output.emit({
      type: 'selectAll',
      data: this.arrSelected
    });

    this.btnDoEvent = true;
  }

  /**
   * Select item.
   * @param item Selected item.
   */
  chboxItem_Selected(item) {
    this.btnDoEvent = false;
    setTimeout(() => {
      // single select !
      if (!this.isSelectable.multi) {
        this.arrSelected = [];
        this.input.arr.forEach(elementSelect => {
          if (elementSelect !== item) {
            elementSelect.select = false;
          }
        });
        if (item.select) {
          this.arrSelected.push(item);
        }
        // multi select !
      } else if (this.isSelectable.multi) {
        const arrTmp = this.input.arr.filter(element => this.checkFilter(element, this.isSelectable));
        if (item.select) {
          if (arrTmp.every(item => item.select)) {
            this.selectAll = true;
          }

          if (!this.arrSelected.includes(item)) {
            this.arrSelected.push(item);
          }

          const foundIndex2 = this.input.arr.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex2 !== -1) {
            this.input.arr[foundIndex2].select = true;
          }

          item.select = true;
        } else {
          if (!arrTmp.every(item => item.select)) {
            this.selectAll = false;
          }

          const foundIndex = this.arrSelected.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex !== -1) {
            this.arrSelected.splice(foundIndex, 1);
          }

          const foundIndex2 = this.input.arr.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex2 !== -1) {
            this.input.arr[foundIndex2].select = false;
          }

          item.select = false;
        }
      }

      this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
      this.input.ds.sort = this.sortTest;

      this.output.emit({
        type: 'select',
        data: this.arrSelected
      });

      this.btnDoEvent = true;
    }, 100);
  }
}
