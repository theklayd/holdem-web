import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IPinquireComponent } from './ipinquire.component';

describe('IPinquireComponent', () => {
  let component: IPinquireComponent;
  let fixture: ComponentFixture<IPinquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IPinquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IPinquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
