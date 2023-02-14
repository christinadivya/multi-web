import { TestBed } from '@angular/core/testing';

import { GetlocationService } from './getlocation.service';

describe('GetlocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetlocationService = TestBed.get(GetlocationService);
    expect(service).toBeTruthy();
  });
});
