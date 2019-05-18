import { TestBed } from '@angular/core/testing';

import { FirestoreToolsService } from './firestore-tools.service';

describe('FirestoreToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreToolsService = TestBed.get(FirestoreToolsService);
    expect(service).toBeTruthy();
  });
});
