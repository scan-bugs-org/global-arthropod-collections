import { TestBed } from '@angular/core/testing';

import { GoogleUserService } from './google-user.service';

describe('GoogleUserService', () => {
  let service: GoogleUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
