import { TestBed, inject } from '@angular/core/testing';

import { LowrankService } from './lowrank.service';

describe('LowrankService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LowrankService]
    });
  });

  it('should be created', inject([LowrankService], (service: LowrankService) => {
    expect(service).toBeTruthy();
  }));
});
