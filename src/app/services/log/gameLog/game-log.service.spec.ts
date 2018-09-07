import { TestBed, inject } from '@angular/core/testing';

import { GameLogService } from './game-log.service';

describe('GameLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameLogService]
    });
  });

  it('should be created', inject([GameLogService], (service: GameLogService) => {
    expect(service).toBeTruthy();
  }));
});
