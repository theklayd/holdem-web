import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawManagementComponent } from './withdraw-management.component';

describe('WithdrawManagementComponent', () => {
  let component: WithdrawManagementComponent;
  let fixture: ComponentFixture<WithdrawManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
