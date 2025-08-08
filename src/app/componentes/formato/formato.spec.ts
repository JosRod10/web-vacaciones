import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Formato } from './formato';

describe('Formato', () => {
  let component: Formato;
  let fixture: ComponentFixture<Formato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Formato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Formato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
