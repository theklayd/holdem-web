import { TestBed, inject } from '@angular/core/testing';

import { OfficeListService } from './office-list.service';

describe('OfficeListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfficeListService]
    });
  });

  it('should be created', inject([OfficeListService], (service: OfficeListService) => {
    expect(service).toBeTruthy();
  }));
});
