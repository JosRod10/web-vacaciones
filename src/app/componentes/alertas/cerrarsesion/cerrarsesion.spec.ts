import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cerrarsesion } from './cerrarsesion';

describe('Cerrarsesion', () => {
  let component: Cerrarsesion;
  let fixture: ComponentFixture<Cerrarsesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cerrarsesion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cerrarsesion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
