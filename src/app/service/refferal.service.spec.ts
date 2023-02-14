import { TestBed } from '@angular/core/testing';

import { RefferalService } from './refferal.service';

describe('RefferalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefferalService = TestBed.get(RefferalService);
    expect(service).toBeTruthy();
  });
});
