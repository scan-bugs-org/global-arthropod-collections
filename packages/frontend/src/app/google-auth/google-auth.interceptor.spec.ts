import { TestBed } from '@angular/core/testing';

import { GoogleAuthInterceptor } from './google-auth.interceptor';

describe('GoogleAuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GoogleAuthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GoogleAuthInterceptor = TestBed.inject(GoogleAuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
