import { TestBed } from '@angular/core/testing';

import { FormToolsService } from './form-tools.service';

describe('FormToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormToolsService = TestBed.get(FormToolsService);
    expect(service).toBeTruthy();
  });
});
