import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyNoticeComponent } from './lobby-notice.component';

describe('LobbyNoticeComponent', () => {
  let component: LobbyNoticeComponent;
  let fixture: ComponentFixture<LobbyNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
