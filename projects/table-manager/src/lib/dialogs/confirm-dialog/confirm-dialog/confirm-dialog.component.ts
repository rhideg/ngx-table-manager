import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  message = '';
  title = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit(): void {
    this.message = this.data.message;
    this.title = this.data.title;
  }

  btnNo_Click() {
    this.dialogRef.close();
  }

  btnYes_Click() {
    this.dialogRef.close();
  }

}
