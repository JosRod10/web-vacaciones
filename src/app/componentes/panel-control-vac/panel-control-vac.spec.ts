import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelControlVac } from './panel-control-vac';

describe('PanelControlVac', () => {
  let component: PanelControlVac;
  let fixture: ComponentFixture<PanelControlVac>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelControlVac]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelControlVac);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
