import { Component } from '@angular/core';
import { ApiServicio } from '../../servicios/api-servicio';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertaFirma } from '../alertas/alerta-firma/alerta-firma';

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
  spinerBandera: boolean = false;
  spinerFirma: boolean = false;

  constructor(private api: ApiServicio, private dialog: MatDialog, private router: Router){
    
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    this.cargarSolicitudes(this.user[0].Tipo);
    
  }

  activarCard(solicitud: any){
    this.cardSolicitud = solicitud;
    
    // const tipoSolicitud = this.cardSolicitud.motivo.includes('Permiso')? 'Permiso' : this.cardSolicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
    // this.cardSolicitud = Object.assign({tipoSolicitud: tipoSolicitud}, this.cardSolicitud);
    
    // this.cardSolicitud.motivo = tipoSolicitud == 'Vacaciones'? this.cardSolicitud.motivo.substring(12,500) : tipoSolicitud == 'Permiso'? this.cardSolicitud.motivo.substring(9,500) : tipoSolicitud == 'Pago tiempo por tiempo'? this.cardSolicitud.motivo.substring(24,500) : this.cardSolicitud.motivo;
  }

  abrirAlerta() {
    const dialogRef = this.dialog.open(Cerrarsesion, {
      width: '500px',
      height: '150px',
      disableClose: false, // true para que no se cierre al hacer clic fuera
    });
  }

  abrirAlertaFirma() {
    const dialogRef = this.dialog.open(AlertaFirma, {
      width: '500px',
      height: '150px',
      disableClose: false, // true para que no se cierre al hacer clic fuera
    });
  }

  // abrirDialogo() {
  //     const dialogConfig = {
  //       data: { id: 123, nombre: 'Ejemplo' } // Tus datos a pasar
  //     };
  //     this.dialog.open(AlertaFirma, dialogConfig);
  // }

  abrirPanelReportes(){
    this.router.navigate(['/reportes']);
  }

  cargarSolicitudes(tipo: string){
    this.api.getSolicitudes(tipo).subscribe(data => {
        this.solicitudes = data;
        this.ausentes = data.filter(solicitud => solicitud.status == 'Ausente');
        
        this.cardSolicitud =  this.solicitudes[0];
        // const tipoSolicitud = this.cardSolicitud.motivo.includes('Permiso')? 'Permiso' : this.cardSolicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
        // this.cardSolicitud = Object.assign({tipoSolicitud: tipoSolicitud}, this.cardSolicitud);
        
        // this.cardSolicitud.motivo = tipoSolicitud == 'Vacaciones'? this.cardSolicitud.motivo.substring(12,500) : tipoSolicitud == 'Permiso'? this.cardSolicitud.motivo.substring(9,500) : tipoSolicitud == 'Pago tiempo por tiempo'? this.cardSolicitud.motivo.substring(24,500) : this.cardSolicitud.motivo;

    });
  }

  activarFirma(id: number){
    this.spinerFirma = !this.spinerFirma;
    this.api.aceptarRI(id).subscribe(
      (response) => {
          if(response == true){
            
            console.log('Se autorizó la firma de RI');
            this.spinerFirma = !this.spinerFirma;
            this.cargarSolicitudes(this.user[0].Tipo);
           
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );
  }

  firmaRelaciones(id: number, accion: number){
    this.spinerBandera = !this.spinerBandera;

    const dias_d = parseInt(this.solicitudes[0].Dias_disponibles) - parseInt(this.solicitudes[0].cuantos_dias);
    const dias_u = parseInt(this.solicitudes[0].Dias_ocupados) + parseInt(this.solicitudes[0].cuantos_dias);
    const clave = this.solicitudes[0].Clave;
    

    this.api.aprobar(id, accion, dias_d, dias_u, clave).subscribe(
      (response) => {
          if(response == true){
            const modalElement = document.getElementById('modal');
            if (modalElement) {
              // Usamos el método 'hide' de Bootstrap para cerrar el modal
              // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
              (window as any).bootstrap.Modal.getInstance(modalElement).hide();
              this.spinerBandera = !this.spinerBandera;
            }
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
  

  firmaJefe(solicitud: any){
    this.spinerBandera = !this.spinerBandera;

    this.api.firmaJefeInmediato(solicitud).subscribe(
      (response) => {
          if(response == true){
            const modalElement = document.getElementById('modal');
            if (modalElement) {
              // Usamos el método 'hide' de Bootstrap para cerrar el modal
              // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
              (window as any).bootstrap.Modal.getInstance(modalElement).hide();
              this.spinerBandera = !this.spinerBandera;
            }
            this.cargarSolicitudes(this.user[0].Tipo);
            // this.miCheckboxJI.nativeElement.checked = false;
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );

  }

  firmaGerente(solicitud: any){
    this.spinerBandera = !this.spinerBandera;
    this.api.firmaGerente(solicitud).subscribe(
      (response) => {
          if(response == true){
            const modalElement = document.getElementById('modal');
            if (modalElement) {
              // Usamos el método 'hide' de Bootstrap para cerrar el modal
              // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
              (window as any).bootstrap.Modal.getInstance(modalElement).hide();
              this.spinerBandera = !this.spinerBandera;
            }
            this.cargarSolicitudes(this.user[0].Tipo);
            // this.miCheckboxG.nativeElement.checked = false;
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
    

    this.api.aprobar(id, accion, dias_d, dias_u, clave).subscribe(
      (response) => {
          if(response == true){

            if(accion == 0){

              const modalElement = document.getElementById('modal-re');
              if (modalElement) {
                // Usamos el método 'hide' de Bootstrap para cerrar el modal
                // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                this.spinerBandera = !this.spinerBandera;
              }
            }
       
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
