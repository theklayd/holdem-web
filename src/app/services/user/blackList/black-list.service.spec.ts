import { TestBed, inject } from '@angular/core/testing';

import { BlackListService } from './black-list.service';

describe('BlackListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlackListService]
    });
  });

  it('should be created', inject([BlackListService], (service: BlackListService) => {
    expect(service).toBeTruthy();
  }));
});
