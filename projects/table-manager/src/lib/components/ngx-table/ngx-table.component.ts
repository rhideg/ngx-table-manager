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
  selectAll;

  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @Input() input: TableSort; // Contains the metadata
  @Input() extraCols; // Contains extra columns(buttons)
  @Input() isSelectable; // Single select when value is 1, multi select if value 2, else no checkbox.
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
      this.input = changes.input.currentValue;

      if ([1, 2].includes(this.isSelectable) && !this.input.arrDispCols.includes('chboxSelect')) {
        this.input.arrDispCols.unshift('chboxSelect');
      }

      this.extraCols.forEach(element => {
        if (!this.input.arrDispCols.includes(element.type)) {
          this.input.arrDispCols.push(element.type);
        }
      });

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

      if (this.input.ds.data.every(item => item.select) && this.input.ds.data.length !== 0) {
        this.selectAll = true;
      } else if (!this.input.ds.data.every(item => item.select) || this.input.ds.data.length === 0) {
        this.selectAll = false;
      }
    })();
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

  btnCustom(element, item) {
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
        }
      });
    } else {
      this.output.emit({
        type: item.type,
        data: element
      });
    }
  }

  /**
   * Select all.
   */
  async chboxAll_select() {
    // ha a ds.length === arrCopy.length -el (Nincs leszűrve a táblázat adatai)
    if (this.input.arr.length === this.input.arrCopy.length) {
      if (!this.input.arr.every(item => item.select)) {
        this.arrSelected = [];
        this.selectAll = true;
        this.input.arr.forEach(element => {
          element.select = true;
          this.arrSelected.push(element);
        });
      } else {
        this.selectAll = false;
        this.input.arr.forEach(element => {
          element.select = false;
          this.arrSelected = [];
        });
      }
    } else {
      if (this.arrSelected.length !== 0) {
        if (!this.input.arr.every(item => item.select)) {
          this.input.arr.forEach(element => {
            if (!element.select) {
              element.select = true;
              this.arrSelected.push(element);
            }
          });
          this.selectAll = true;
        } else {
          this.input.arr.forEach(element => {
            const foundIndex = this.arrSelected.findIndex(item => this.objectsAreEquivalent(element, item));
            element.select = false;
            if (foundIndex !== -1) {
              this.arrSelected.splice(foundIndex, 1);
            }
          });
          this.selectAll = false;
        }
      } else {
        if (!this.input.arr.every(item => item.select)) {
          this.arrSelected = [];
          this.selectAll = true;
          this.input.arr.forEach(element => {
            element.select = true;
            this.arrSelected.push(element);
          });
        }
      }
    }

    this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
    this.input.ds.sort = this.sortTest;

    this.output.emit({
      type: 'selectAll',
      data: this.arrSelected
    });
  }

  /**
   * Select item.
   * @param item Selected item.
   */
  chboxItem_Selected(item) {
    // single select !
    if (this.isSelectable === 1) {
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
    } else if (this.isSelectable === 2) {
      if (item.select) {
        if (this.input.arr.every(item => item.select)) {
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
        if (!this.input.arr.every(item => item.select)) {
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

  }
}
