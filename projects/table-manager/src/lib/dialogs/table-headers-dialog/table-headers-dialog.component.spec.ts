import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadersDialogComponent } from './table-headers-dialog.component';

describe('TableHeadersDialogComponent', () => {
  let component: TableHeadersDialogComponent;
  let fixture: ComponentFixture<TableHeadersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHeadersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHeadersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
