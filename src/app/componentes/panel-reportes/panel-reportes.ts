import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiServicio } from '../../servicios/api-servicio';

@Component({
  selector: 'app-panel-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './panel-reportes.html',
  styleUrl: './panel-reportes.css'
})
export class PanelReportes {

  user: any;
  consultaForm: FormGroup
  solicitudes: any;

  constructor(private dialog: MatDialog, private router: Router, private fb: FormBuilder, private api: ApiServicio){

    this.consultaForm = this.fb.group({
      criterio: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
  }

  abrirAlerta() {
      const dialogRef = this.dialog.open(Cerrarsesion, {
        width: '500px',
        height: '150px',
        disableClose: false, // true para que no se cierre al hacer clic fuera
      });
  }

  volver(){
    this.router.navigate(['/panel-solicitud']);
  }

  consultar(){
    this.api.consultaReporteSolicitud(this.consultaForm.value).subscribe(
      (response) => {
        const data =  response;
        this.solicitudes = data;
        console.log(data);
      },
      (error) => {
           console.error('Error al obtener datos:', error);
         }

    );
  }

}
