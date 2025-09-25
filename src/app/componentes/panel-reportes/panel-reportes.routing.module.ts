import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelReportes } from '../panel-reportes/panel-reportes';

const routes: Routes = [
  { path: '', component: PanelReportes }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelReportesRoutingModule { }