import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectingUserComponent } from './connecting-user.component';

describe('ConnectingUserComponent', () => {
  let component: ConnectingUserComponent;
  let fixture: ComponentFixture<ConnectingUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectingUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
