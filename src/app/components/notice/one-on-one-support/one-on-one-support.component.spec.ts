import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOnOneSupportComponent } from './one-on-one-support.component';

describe('OneOnOneSupportComponent', () => {
  let component: OneOnOneSupportComponent;
  let fixture: ComponentFixture<OneOnOneSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneOnOneSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneOnOneSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
