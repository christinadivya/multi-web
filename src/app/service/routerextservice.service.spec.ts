import { TestBed } from '@angular/core/testing';

import { RouterextserviceService } from './routerextservice.service';

describe('RouterextserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterextserviceService = TestBed.get(RouterextserviceService);
    expect(service).toBeTruthy();
  });
});
