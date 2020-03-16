import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableManagerComponent } from './table-manager.component';

describe('TableManagerComponent', () => {
  let component: TableManagerComponent;
  let fixture: ComponentFixture<TableManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
