import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchDialogComponent } from './dialogs/advanced-search-dialog/advanced-search-dialog.component';
import { TableHeadersDialogComponent } from './dialogs/table-headers-dialog/table-headers-dialog.component';
import { TableSort } from './models/table-sort';
import { AdvancedSearchService } from './services/advanced-search.service';

@Component({
  selector: 'ngx-table-manager',
  templateUrl: 'table-manager.component.html',
  styleUrls: ['table-manager.component.scss']
})
export class TableManagerComponent implements OnChanges, OnInit {

  loaded = false; // Is the data loaded
  searchValue = ''; // Default search value
  // selection = new SelectionModel<any>(true, []);
  options: any[] = [];

  // Basic inputs and outputs
  @Input() input: TableSort; // Contains the metadata
  @Input() selectedColor?: string; // Color theme
  @Output() output = new EventEmitter<TableSort>(); // Notify parent on input change
  @Output() dispColsSelect = new EventEmitter<any>(); // Notify parent on displayed cols change

  // Define what the user would like to see
  @Input() advencedSearch = true;
  @Input() fastSearch = true;
  @Input() displayColumns = true;
  @Input() inputSearch = true;
  @Input() startSearch = true;
  @Input() columnSticky = false;
  @Input() colorPickerText = false;
  @Input() colorPickerBackground = false;
  constructor(
    public dialog: MatDialog,
    private advSearchService: AdvancedSearchService
  ) {
  }

  /**
   * If the input has value, set loaded to true.
   * @param changes Input change
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.input.currentValue) {
      this.loaded = true;
    }
  }

  ngOnInit() {
  }

  /**
   * Currently not in use.
   * @param value
   */
  private _filter(value: string): string[] {
    const filterValue = (typeof (value) == 'string' && value) ? value.toLowerCase() : value;

    return this.options.filter(
      option => option.toString().toLowerCase().indexOf(filterValue) === 0
    );

  }

  /**
   * Advanced search, first show the dialog, then get the values returned by
   * the search service, finally emit the changes.
   */
  btnAdvSearch_Click() {
    let arrSearch = [];
    arrSearch = this.input.arrCols;

    const dialogRef = this.dialog.open(AdvancedSearchDialogComponent, {
      height: '60vh',
      width: '60vw',
      data: arrSearch
    });

    dialogRef.afterClosed().subscribe(async result => {
      let arrResult = [];

      arrResult = JSON.parse(
        JSON.stringify(
          this.advSearchService.searchCols(result, this.input.arrCopy)
        )
      );
      if (arrResult.length === 0) {
        this.input.empty = true;
        this.input.arr = [];

        this.output.emit(this.input);
      } else {
        this.input.arr = arrResult;
        this.input.empty = false;
        this.input.count = 30;

        this.output.emit(this.input);
      }
    });
  }

  /**
   * Quick search selection change, change the column to search.
   * @param event
   */
  slQuickSearch_SelectionChange(event) {
    if (event.option.selected) {
      event.source.deselectAll();
      event.option._setSelected(true);

      this.input.search = event.option.value;
    }
  }

  /**
   * Execute quick search.
   */
  btnSearch_Click() {

    if (this.searchValue === undefined || this.searchValue === '') {
      this.input.count = 30;
      this.input.arr = this.input.arrCopy;
      this.input.empty = false;
    } else {
      let arrSearched = this.input.arrCopy;

      arrSearched = this.input.arrCopy.filter(szall => {
        if (
          szall[`${this.input.search.name}`] &&
          szall[`${this.input.search.name}`]
            .toString()
            .toLowerCase()
            .includes(this.searchValue.toString().toLowerCase())
        ) {
          return szall;
        }
      });

      this.input.arr = arrSearched;
      if (this.input.arr.length === 0) {
        this.input.empty = true;
      } else {
        this.input.count = 30;
        this.input.empty = false;
      }
    }
    this.output.emit(this.input);
  }

  /**
   * Show dialog with collumn options, wait for the changes and then emit.
   */
  btnShowColumns_Click() {
    const dialogRef = this.dialog.open(TableHeadersDialogComponent, {
      panelClass: 'myapp-no-padding-dialog',
      minWidth: '60vw',
      maxHeight: '80vh',
      data: {
        cols: this.input.arrCols,
        color: this.selectedColor,
        colorPickerBackgroundBool: this.colorPickerBackground,
        colorPickerTextBool: this.colorPickerText,
        columnStickyBool: this.columnSticky,
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      this.input.arrCols = result;
      this.dispColsSelect.emit(result);
    });

    this.output.emit(this.input);
  }

}
