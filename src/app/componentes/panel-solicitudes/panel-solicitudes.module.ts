import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PanelSolicitudes } from './panel-solicitudes';

const routes: Routes = [{ path: '', component: PanelSolicitudes }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PanelSolicitudesModule { }