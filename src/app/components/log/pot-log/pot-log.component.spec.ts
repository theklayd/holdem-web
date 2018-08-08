import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PotLogComponent } from './pot-log.component';

describe('PotLogComponent', () => {
  let component: PotLogComponent;
  let fixture: ComponentFixture<PotLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PotLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PotLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
