import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaFirma } from './alerta-firma';

describe('AlertaFirma', () => {
  let component: AlertaFirma;
  let fixture: ComponentFixture<AlertaFirma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaFirma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaFirma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
