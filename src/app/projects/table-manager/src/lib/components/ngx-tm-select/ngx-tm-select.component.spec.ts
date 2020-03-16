import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTmSelectComponent } from './ngx-tm-select.component';

describe('NgxTmSelectComponent', () => {
  let component: NgxTmSelectComponent;
  let fixture: ComponentFixture<NgxTmSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTmSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTmSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
