import { TestBed } from '@angular/core/testing';

import { TableManagerService } from './table-manager.service';

describe('TableManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableManagerService = TestBed.get(TableManagerService);
    expect(service).toBeTruthy();
  });
});
