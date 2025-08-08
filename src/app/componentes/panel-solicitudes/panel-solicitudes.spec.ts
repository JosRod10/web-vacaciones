import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSolicitudes } from './panel-solicitudes';

describe('PanelSolicitudes', () => {
  let component: PanelSolicitudes;
  let fixture: ComponentFixture<PanelSolicitudes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelSolicitudes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSolicitudes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
