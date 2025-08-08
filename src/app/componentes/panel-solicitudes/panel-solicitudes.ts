import { Component } from '@angular/core';
import { ApiServicio } from '../../servicios/api-servicio';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-solicitudes.html',
  styleUrl: './panel-solicitudes.css'
})
export class PanelSolicitudes {

  solicitudes: any;
  ausentes: any;
  cardSolicitud: any;
  user: any;

  constructor(private api: ApiServicio, private dialog: MatDialog, private router: Router){

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    this.cargarSolicitudes();
  }

  activarCard(solicitud: any){
    this.cardSolicitud = solicitud;
  }

  abrirAlerta() {
    const dialogRef = this.dialog.open(Cerrarsesion, {
      width: '500px',
      height: '150px',
      disableClose: false, // true para que no se cierre al hacer clic fuera
    });
  }

  abrirPanelReportes(){
    this.router.navigate(['/reportes']);
  }

  cargarSolicitudes(){
    this.api.getSolicitudes().subscribe(data => {
        // this.items = data;
        console.log(data);
        this.solicitudes = data.filter(solicitud => solicitud.status == 'Pendiente');
        this.ausentes = data.filter(solicitud => solicitud.status == 'Ausente');
        console.log(this.solicitudes, this.ausentes);
        this.cardSolicitud = this.solicitudes[0].status == 'Pendiente' ? this.solicitudes[0] : {};
    });
  }

  accion(id: number, accion: number){
    const dias_d = this.solicitudes[0].Dias_disponibles - this.solicitudes[0].cuantos_dias;
    const dias_u = parseInt(this.solicitudes[0].Dias_ocupados) + parseInt(this.solicitudes[0].cuantos_dias);
    const clave = this.solicitudes[0].Clave;
    
    console.log(dias_d, dias_u)
    this.api.aprobar(id, accion, dias_d, dias_u, clave).subscribe(
      (response) => {
          if(response == true){
            this.cargarSolicitudes();
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );
  }


}
