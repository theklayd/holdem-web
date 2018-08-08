import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadOfficeListComponent } from './head-office-list.component';

describe('HeadOfficeListComponent', () => {
  let component: HeadOfficeListComponent;
  let fixture: ComponentFixture<HeadOfficeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadOfficeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadOfficeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
