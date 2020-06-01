import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnChanges, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
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
  /* loading = true; */

  objColumnSearch: any = {};

  Arr = new Array(40);

  linkItem;
  isSingleClick: Boolean = true;

  @ContentChild(TemplateRef) template: TemplateRef<any>;


  @Input() input: TableSort; // Contains the metadata

  @Input() isRowSelect; // If true then row selected.
  @Input() numberFormat; // Number format.
  @Input() rowColor; // Single select when multi value is false, multi select if value true.
  @Input() loading; // Single select when multi value is false, multi select if value true.
  @Input() columnSearch?: boolean; // Click on column to perform a column search.
  @Input() resizable?: boolean; // Resizable columns.
  @Output() output = new EventEmitter<any>(); // returns element

  @ViewChild('sort', { static: false }) sort: MatSort; // Material table sort
  constructor(
    public dialog: MatDialog,
  ) {
    console.log(this.input);
  }

  ngOnInit(): void {
    console.log(this.input);
  }

  /**
   * Listen for changes and set input.
   * @param changes Change.
   */
  ngOnChanges(changes): void {
    console.log('%cCHANGE', 'color: yellow');
    this.input.setSort(this.sort);

    if (changes.hasOwnProperty('loading') && Object.getOwnPropertyNames(changes).length === 1) {
      document.getElementById('mainDiv').style.overflow = 'auto';
    }
  }

  checkFilter(element, item) {
    let ret = false;
    if (item.filter) {
      const arrRet = [];
      item.filter.forEach(filterElement => {
        switch (filterElement.relation) {
          case 'length':
            if ((element[filterElement.col].length === filterElement.value[0])) {
              arrRet.push(false);
            }
            break;
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
      // this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
      // this.input.ds.sort = this.sort;

      this.input.setDataSource(this.sort);
    }
  }

  /**
   * Select row (single click).
   * @param element Selected row element.
   */
  rowSelected(element) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        if (this.btnDoEvent) {
          this.output.emit({
            type: 'rowSelected',
            data: element,
            link: this.linkItem
          });
  
          this.linkItem = null;
        }
      }
    }, 250);
  }

  /**
   * Double click on row.
   * @param element Row element
   */
  rowDoubleClick(element){
    this.isSingleClick = false;
    this.output.emit({
      type: 'rowDoubleClick',
      data: element,
      link: this.linkItem
    });

    this.linkItem = null;
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

  checkAllSelected() {
    const arrTmp = this.input.arr.filter(element => this.checkFilter(element, this.input.getSelect));
    const a = arrTmp.every(i => i.select);
    return a;
  }

  /**
   * Select all.
   */
  async chboxAll_select() {
    this.btnDoEvent = false;
    const arrTmp = this.input.arr.filter(item => this.checkFilter(item, this.input.getSelect));
    if (this.input.arr.length === this.input.arrCopy.length) {
      if (!arrTmp.every(item => item.select)) {
        this.input.arrSelected = [];
        this.selectAll = true;
        arrTmp.forEach(element => {
          element.select = true;
          this.input.arrSelected.push(element);
        });
      } else {
        this.selectAll = false;
        arrTmp.forEach(element => {
          element.select = false;
          this.input.arrSelected = [];
        });
      }
    } else {
      if (this.input.arrSelected.length !== 0) {
        if (!arrTmp.every(item => item.select)) {
          arrTmp.forEach(element => {
            if (!element.select) {
              element.select = true;
              this.input.arrSelected.push(element);
            }
          });
          this.selectAll = true;
        } else {
          arrTmp.forEach(element => {
            const foundIndex = this.input.arrSelected.findIndex(item => this.objectsAreEquivalent(element, item));
            element.select = false;
            if (foundIndex !== -1) {
              this.input.arrSelected.splice(foundIndex, 1);
            }
          });
          this.selectAll = false;
        }
      } else {
        if (!arrTmp.every(item => item.select)) {
          this.input.arrSelected = [];
          this.selectAll = true;
          arrTmp.forEach(element => {
            element.select = true;
            this.input.arrSelected.push(element);
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

    // this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
    // this.input.ds.sort = this.sort;

    this.input.setDataSource(this.sort);


    this.output.emit({
      type: 'selectAll',
      data: this.input.arrSelected
    });

    this.btnDoEvent = true;
  }

  /**
   * Select item.
   * @param item Selected item.
   */
  chboxItem_Selected(item) {
    this.btnDoEvent = false;

    /*this.input.addSelected(item, this.select.multi)
    this.output.emit({
      type: 'select',
      data: this.input.arrSelected
    });
    this.btnDoEvent = true;
    console.log(this.input.arrSelected);*/


    setTimeout(() => {
      // single select !
      if (!this.input.getSelect.multi) {

        //this.input.arrSelected = [];
        this.input.arrSelected = [];
        // this.input.clearSelected();

        this.input.arr.forEach(elementSelect => {
          if (elementSelect !== item) {
            elementSelect.select = false;
          }
        });
        if (item.select) {
          // this.input.addSelected(item);
          this.input.arrSelected.push(item);
        }
        // multi select !
      } else if (this.input.getSelect.multi) {
        const arrTmp = this.input.arr.filter(element => this.checkFilter(element, this.input.getSelect));
        if (item.select) {
          if (arrTmp.every(item => item.select)) {
            this.selectAll = true;
          }

          // this.input.addSelected(item);
          if (!this.input.arrSelected.includes(item)) {
            this.input.arrSelected.push(item);
          }

          const foundIndex2 = this.input.arr.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex2 !== -1) {
            this.input.arr[foundIndex2].select = true;
          }

          item.select = true;
        } else {
          // this.input.addSelected(item);

          if (!arrTmp.every(item => item.select)) {
            this.selectAll = false;
          }

          const foundIndex = this.input.arrSelected.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex !== -1) {
            this.input.arrSelected.splice(foundIndex, 1);
          }

          const foundIndex2 = this.input.arr.findIndex(element => this.objectsAreEquivalent(item, element));
          if (foundIndex2 !== -1) {
            this.input.arr[foundIndex2].select = false;
          }

          item.select = false;
        }
      }

      // this.input.ds = new MatTableDataSource(this.input.arr.slice(0, this.input.count));
      // this.input.ds.sort = this.sort;


       this.input.setDataSource();

      this.output.emit({
        type: 'select',
        data: this.input.arrSelected
        // data: this.input.arrSelected

      });

      this.btnDoEvent = true;
    }, 100);
  }


  link_Click(item) {
    this.linkItem = item;
  }



  showColumnSearch(id) {
    if (this.columnSearch) {
      var inp = document.getElementById(`inp-${id}`);
      if (inp.style.display === "none") {
        inp.style.display = "block";
      } else {
        inp.style.display = "none";
        delete this.objColumnSearch[id];
        this.searchColumnInput();
      }

      var col = document.getElementById(`col-${id}`);
      if (col.style.display === "none") {
        col.style.display = "block";
      } else {
        col.style.display = "none";
      }
    }
  }

  columnSearchInput(e, itemName) {
    const value = e.srcElement.value;
    const itemN = itemName;
  }

  searchColumnInput() {
    this.input.columnSearch(this.objColumnSearch);
  }
}
