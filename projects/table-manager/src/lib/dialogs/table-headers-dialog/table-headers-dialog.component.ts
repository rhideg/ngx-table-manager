import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-table-headers-dialog',
  templateUrl: './table-headers-dialog.component.html',
  styleUrls: ['./table-headers-dialog.component.scss']
})
export class TableHeadersDialogComponent implements OnInit {

  arrHeaders = [];
  selectedColor;

  // Drag and drop, first and second column.
  first = [];
  second = [];

  constructor(
    public dialogRef: MatDialogRef<TableHeadersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedColor = data.color ? data.color : 'black';
    this.arrHeaders = data.cols;
    dialogRef.backdropClick().subscribe(result => {
      this.arrHeaders = this.first.concat(this.second);
      dialogRef.close(this.arrHeaders);
    });

    /**
     * Add the sliced data to the first and second array.
     * Helper to perform drag and drop.
     */
    const size = this.arrHeaders.length;
    const sf = size % 2 === 0 ? size / 2 : Math.floor(size / 2) + 1;
    const ss = size - sf;
    this.first = this.arrHeaders.slice(0, sf);
    this.second = this.arrHeaders.slice(sf, size)
  }

  ngOnInit() {

  }

  /**
   * Visible: visible in the table view.
   * @param item 
   */
  setVisibility(item) {
    const index = this.arrHeaders.indexOf(item);

    if (index !== -1) {
      this.arrHeaders[index].show = !this.arrHeaders[index].show;
    }
  }

  /**
   * Sticky: stays on the side if scrolled horizontally.
   * @param item 
   */
  setSticky(item) {
    const index = this.arrHeaders.indexOf(item);

    if (index !== -1) {
      this.arrHeaders[index].sticky = !this.arrHeaders[index].sticky;
    }
  }

  /**
   * Execute drag and drop.
   * @param event 
   */
  dropGroup(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    if (this.first.length < this.second.length) {

      this.first[this.first.length] = this.second[0];
      this.second.shift();
    }

    if ((this.first.length - this.second.length) > 1) {
      this.second.unshift(this.first[this.first.length - 1]);
      this.first.pop();
    }
    
  }
}
