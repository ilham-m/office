import { TestBed } from '@angular/core/testing';

import { AkadService } from './akad.service';

describe('AkadService', () => {
  let service: AkadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AkadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
