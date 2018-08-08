import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositManagementComponent } from './deposit-management.component';

describe('DepositManagementComponent', () => {
  let component: DepositManagementComponent;
  let fixture: ComponentFixture<DepositManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
