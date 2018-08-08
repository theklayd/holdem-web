import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InGamingTableComponent } from './in-gaming-table.component';

describe('InGamingTableComponent', () => {
  let component: InGamingTableComponent;
  let fixture: ComponentFixture<InGamingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InGamingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InGamingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
