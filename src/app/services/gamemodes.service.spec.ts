import { TestBed } from '@angular/core/testing';

import { GamemodesService } from './gamemodes.service';

describe('GamemodesService', () => {
  let service: GamemodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamemodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
