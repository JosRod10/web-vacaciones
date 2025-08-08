import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelReportes } from './panel-reportes';

describe('PanelReportes', () => {
  let component: PanelReportes;
  let fixture: ComponentFixture<PanelReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelReportes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelReportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
