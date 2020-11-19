import { TestBed } from '@angular/core/testing';

import { ProgressHelperService } from './progress-helper.service';

describe('ProgressHelperService', () => {
  let service: ProgressHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
