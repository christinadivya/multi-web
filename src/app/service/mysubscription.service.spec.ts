import { TestBed } from '@angular/core/testing';

import { MysubscriptionService } from './mysubscription.service';

describe('MysubscriptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MysubscriptionService = TestBed.get(MysubscriptionService);
    expect(service).toBeTruthy();
  });
});
