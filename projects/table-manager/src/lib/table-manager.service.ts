import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableSort } from 'table-manager/public-api';

@Injectable({
  providedIn: 'root'
})
export class TableManagerService {

  ts: TableSort;
  public tmSubject: BehaviorSubject<TableSort>;

  constructor() { 
    this.tmSubject = new BehaviorSubject(this.ts);
  }

  setTs(ts: TableSort) {
    this.ts = ts;
    this.tmSubject.next(this.ts);
  }



  
}
