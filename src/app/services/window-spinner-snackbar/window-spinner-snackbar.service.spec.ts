import { TestBed } from '@angular/core/testing';

import { WindowSpinnerSnackbarService } from './window-spinner-snackbar.service';

describe('WindowSpinnerSnackbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindowSpinnerSnackbarService = TestBed.get(WindowSpinnerSnackbarService);
    expect(service).toBeTruthy();
  });
});
