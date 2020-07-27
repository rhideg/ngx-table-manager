import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'advanced-search-dialog',
  templateUrl: './advanced-search-dialog.component.html',
  styleUrls: ['./advanced-search-dialog.component.scss']
})
export class AdvancedSearchDialogComponent implements OnInit {

  arrSearch; 
  arrOperators = ['=', '>', '<']; // Currently not in use.

  
  constructor(
    public dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.arrSearch = data;

    dialogRef.backdropClick().subscribe(result => {
      dialogRef.close(this.arrSearch);
    });

  }

  ngOnInit() {
    
  }

  btnSearch_Click() {
    this.dialogRef.close(this.arrSearch);
  }


}
