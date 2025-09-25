import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form } from './solicitud';

const routes: Routes = [
  { path: '', component: Form }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudRoutingModule { }