import { Component } from '@angular/core';
import { ApiServicio } from '../../servicios/api-servicio';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-panel-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-solicitudes.html',
  styleUrl: './panel-solicitudes.css'
})
export class PanelSolicitudes {
  @ViewChild('miCheckboxRI') miCheckboxRI!: ElementRef;
  @ViewChild('miCheckboxJI') miCheckboxJI!: ElementRef;
  @ViewChild('miCheckboxG') miCheckboxG!: ElementRef;

  solicitudes: any;
  ausentes: any;
  cardSolicitud: any;
  user: any;
  firmaCheck: boolean =  false;

  constructor(private api: ApiServicio, private dialog: MatDialog, private router: Router){
    
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    this.cargarSolicitudes(this.user[0].Tipo);
    console.log(this.user);
  }

  activarCard(solicitud: any){
    this.cardSolicitud = solicitud;
    console.log(this.cardSolicitud);
    const tipoSolicitud = this.cardSolicitud.motivo.includes('Permiso')? 'Permiso' : this.cardSolicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
    this.cardSolicitud = Object.assign({tipoSolicitud: tipoSolicitud}, this.cardSolicitud);
    console.log(this.cardSolicitud);
    this.cardSolicitud.motivo = tipoSolicitud == 'Vacaciones'? this.cardSolicitud.motivo.substring(12,100) : tipoSolicitud == 'Permiso'? this.cardSolicitud.motivo.substring(9,100) : tipoSolicitud == 'Pago tiempo por tiempo'? this.cardSolicitud.motivo.substring(24,100) : this.cardSolicitud.motivo;
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

  cargarSolicitudes(tipo: string){
    this.api.getSolicitudes(tipo).subscribe(data => {
        // this.items = data;
        console.log(data);
        this.solicitudes = data;
        this.ausentes = data.filter(solicitud => solicitud.status == 'Ausente');
        console.log(this.solicitudes, this.ausentes);
        this.cardSolicitud =  this.solicitudes[0];
        const tipoSolicitud = this.cardSolicitud.motivo.includes('Permiso')? 'Permiso' : this.cardSolicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
        this.cardSolicitud = Object.assign({tipoSolicitud: tipoSolicitud}, this.cardSolicitud);
        console.log(this.cardSolicitud);
        this.cardSolicitud.motivo = tipoSolicitud == 'Vacaciones'? this.cardSolicitud.motivo.substring(12,100) : tipoSolicitud == 'Permiso'? this.cardSolicitud.motivo.substring(9,100) : tipoSolicitud == 'Pago tiempo por tiempo'? this.cardSolicitud.motivo.substring(24,100) : this.cardSolicitud.motivo;

    });
  }

  activarFirma(){
    this.firmaCheck = true;
  }

  firmaJefe(id: number){

    this.api.firmaJefeInmediato(id).subscribe(
      (response) => {
          if(response == true){
            this.cargarSolicitudes(this.user[0].Tipo);
            this.miCheckboxJI.nativeElement.checked = false;
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );

  }

  firmaGerente(id: number){

    this.api.firmaGerente(id).subscribe(
      (response) => {
          if(response == true){
            this.cargarSolicitudes(this.user[0].Tipo);
            this.miCheckboxG.nativeElement.checked = false;
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );

  }

  accion(id: number, accion: number){
    const dias_d = parseInt(this.solicitudes[0].Dias_disponibles) - parseInt(this.solicitudes[0].cuantos_dias);
    const dias_u = parseInt(this.solicitudes[0].Dias_ocupados) + parseInt(this.solicitudes[0].cuantos_dias);
    const clave = this.solicitudes[0].Clave;
    
    console.log(dias_d, dias_u)
    this.api.aprobar(id, accion, dias_d, dias_u, clave).subscribe(
      (response) => {
          if(response == true){
            this.cargarSolicitudes(this.user[0].Tipo);
            this.firmaCheck = false;
            this.miCheckboxRI.nativeElement.checked = false;
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );
  }


}
