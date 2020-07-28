import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'advanced-search-dialog',
  templateUrl: './advanced-search-dialog.component.html',
  styleUrls: ['./advanced-search-dialog.component.scss']
})
export class AdvancedSearchDialogComponent implements OnInit {

  arrCols = []; 
  arrColsAll = [];

  arrAs = [];

  defaultOperator = '=';
  arrOperators = ['=', '>', '>=', '<=' , '<', '~', 'in', 'between']; // Currently not in use.
  lineObj : any = {};

  
  constructor(
    public dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const ac = data.cols.map(c => {
      return {title: c.title, name: c.name};
    });
    
    this.arrCols = JSON.parse(JSON.stringify(ac));
    this.arrColsAll = JSON.parse(JSON.stringify(ac));

    // Splice existing filter fields from cols array
    if (data.asArr) {
      for (let i = 0; i < data.asArr.length; i++) {
        const e = data.asArr[i];
        for (let j = 0; j < this.arrCols.length; j++) {
          const f = this.arrCols[j];
          if (e.field === f.name) {
            this.arrCols.splice(this.arrCols.indexOf(f),1);
          }
        }
      }
    }

    this.arrAs = data.asArr ?? [];

    dialogRef.backdropClick().subscribe(result => {
      dialogRef.close(this.arrAs);
    });

    this.lineObj.operator = this.defaultOperator;

  }

  ngOnInit() {
  }

  btnSearch_Click() {
    this.dialogRef.close(this.arrAs);
  }

  btnAdd_Click() {
    for (let i = 0; i < this.arrCols.length; i++) {
      const e = this.arrCols[i];
      if (e.name === this.lineObj.field) {
        this.arrCols.splice(i,1);
        break;
      }
    }
    
    this.arrAs.push(this.lineObj);
    this.lineObj = {};
    this.lineObj.operator = this.defaultOperator;
  }

  btnDel_Click(line) {
    for (let i = 0; i < this.arrColsAll.length; i++) {
      const e = this.arrColsAll[i];
      if (e.name === line.field) {
        this.arrCols.push(e);
        this.arrCols.sort((a,b) => {
          return a.title < b.title ? -1 : (a.title > b.title ? 1 : 0);
        })
        break;  
      }
    }
    this.arrAs.splice(this.arrAs.indexOf(line), 1);
  }





}
