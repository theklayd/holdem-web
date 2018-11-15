import { TestBed, inject } from '@angular/core/testing';

import { DashboardMidManService } from './dashboard-mid-man.service';

describe('DashboardMidManService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardMidManService]
    });
  });

  it('should be created', inject([DashboardMidManService], (service: DashboardMidManService) => {
    expect(service).toBeTruthy();
  }));
});
