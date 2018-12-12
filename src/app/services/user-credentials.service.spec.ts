import { TestBed, inject } from '@angular/core/testing';

import { UserCredentialsService } from './user-credentials.service';

describe('UserCredentialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCredentialsService]
    });
  });

  it('should be created', inject([UserCredentialsService], (service: UserCredentialsService) => {
    expect(service).toBeTruthy();
  }));
});
