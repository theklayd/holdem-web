import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateManageComponent } from './calculate-manage.component';

describe('CalculateManageComponent', () => {
  let component: CalculateManageComponent;
  let fixture: ComponentFixture<CalculateManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
