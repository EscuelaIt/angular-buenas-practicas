import { TestBed } from '@angular/core/testing';

import { ConfigAppService } from './config-app.service';

describe('ConfigAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigAppService = TestBed.get(ConfigAppService);
    expect(service).toBeTruthy();
  });
});
