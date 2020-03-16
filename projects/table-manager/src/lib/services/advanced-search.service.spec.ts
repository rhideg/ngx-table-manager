import { TestBed } from '@angular/core/testing';

import { AdvancedSearchService } from './advanced-search.service';

describe('AdvancedSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvancedSearchService = TestBed.get(AdvancedSearchService);
    expect(service).toBeTruthy();
  });
});
