import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JackpotLogComponent } from './jackpot-log.component';

describe('JackpotLogComponent', () => {
  let component: JackpotLogComponent;
  let fixture: ComponentFixture<JackpotLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JackpotLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JackpotLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
