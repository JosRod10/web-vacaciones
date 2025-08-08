import { TestBed } from '@angular/core/testing';

import { ApiServicio } from './api-servicio';

describe('ApiServicio', () => {
  let service: ApiServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
