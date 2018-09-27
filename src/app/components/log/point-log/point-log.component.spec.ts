import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointLogComponent } from './point-log.component';

describe('PointLogComponent', () => {
  let component: PointLogComponent;
  let fixture: ComponentFixture<PointLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
