import { TestBed, inject } from '@angular/core/testing';

import { UserProfitService } from './user-profit.service';

describe('UserProfitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProfitService]
    });
  });

  it('should be created', inject([UserProfitService], (service: UserProfitService) => {
    expect(service).toBeTruthy();
  }));
});
