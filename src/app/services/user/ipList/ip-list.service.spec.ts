import { TestBed, inject } from '@angular/core/testing';

import { IpListService } from './ip-list.service';

describe('IpListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpListService]
    });
  });

  it('should be created', inject([IpListService], (service: IpListService) => {
    expect(service).toBeTruthy();
  }));
});
