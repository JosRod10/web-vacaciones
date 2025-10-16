import { Component } from '@angular/core';
import { ApiServicio } from '../../servicios/api-servicio';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertaFirma } from '../alertas/alerta-firma/alerta-firma';
import { PanelReportes } from '../panel-reportes/panel-reportes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-solicitudes',
  standalone: true,
  imports: [CommonModule, PanelReportes, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, 
    MatGridListModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './panel-solicitudes.html',
  styleUrl: './panel-solicitudes.css'
})
export class PanelSolicitudes {
  @ViewChild('miCheckboxRI') miCheckboxRI!: ElementRef;
  @ViewChild('miCheckboxJI') miCheckboxJI!: ElementRef;
  @ViewChild('miCheckboxG') miCheckboxG!: ElementRef;
  @ViewChild('alerToast') alerToast!: ElementRef;

  solicitudes: any;
  ausentes: any;
  cardSolicitud: any;
  user: any;
  firmaCheck: boolean =  false;
  spinerBandera: boolean = false;
  spinerFirma: boolean = false;
  spinerDelete: boolean = false;
  
  banderaDash: boolean = true;
  banderaReporte: boolean = false;
  banderaDia: boolean = false;

  solicitudForm: FormGroup;

  fecha_hoy: string = '';
  fecha: any = '';
  ano_hoy: string = '';

  arregloClaves: any[] = [];
  alertSuccess: boolean = false;
  alertDanger: boolean = false;

  solicitudPendienteGerente: any[] = [];
  solicitudPendienteAceptar: any[] = [];

  constructor(private api: ApiServicio, private dialog: MatDialog, private router: Router, private fb: FormBuilder){

    this.solicitudForm = this.fb.group({
      cDias: ['', [Validators.required]],
      fechaApartir: ['', [Validators.required]],
      fechaHasta: ['', [Validators.required]],
      motivo: ['', [Validators.required,]],// Validators.minLength(10)
      fecha: ['', [Validators.required]],
      año: ['', [Validators.required]],
    });
    
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

  cambiarDash(){
    this.banderaDash = true;
    this.banderaReporte = false;
    this.banderaDia = false;
    this.cargarSolicitudes(this.user[0].Tipo);
  }

  cambiarReporte(){
    this.banderaReporte = true;
    this.banderaDash = false;
    this.banderaDia = false;
  }

  cambiarDia(){
    this.banderaDia = true;
    this.banderaReporte = false;
    this.banderaDash = false;
  }

  abrirPanelReportes(){
    this.router.navigate(['/reportes']);
  }

  convertirFecha(fecha: string){
    const [year, month, day] = fecha.split('-');
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Crear un objeto Date a partir de la cadena original (se le pasa el año, mes, día)
    const fechaObjeto = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    // Obtener el día, mes y año del objeto Date
    const dia = fechaObjeto.getDate();
    const mes = meses[fechaObjeto.getMonth()];
    const anio = fechaObjeto.getFullYear();

    // Formatear la nueva cadena
    const fechaFormateada = `${dia.toString().padStart(2, '0')} de ${mes} de ${anio}`;
    return fechaFormateada
  }

  cargarSolicitudes(tipo: string){
    this.api.getSolicitudes(tipo).subscribe(data => {
        this.solicitudes = data.filter(solicitud => solicitud.status != 'Ausente');
        console.log(this.solicitudes);
        this.solicitudes = this.solicitudes.map((ele: any)=>{
          ele.fecha_apartir = this.convertirFecha(ele.fecha_apartir);
          ele.fecha_hasta = this.convertirFecha(ele.fecha_hasta);
          return ele;
        });
        
        this.ausentes = data.filter(solicitud => solicitud.status == 'Ausente');
        this.ausentes = this.ausentes.map((ele: any)=>{
          ele.fecha_apartir = this.convertirFecha(ele.fecha_apartir);
          ele.fecha_hasta = this.convertirFecha(ele.fecha_hasta);
          return ele;
        });
        if(this.user[0].Tipo == 'RI'){
          this.solicitudPendienteGerente = data.filter(solicitud => solicitud.firms_gerente == '');
          this.solicitudPendienteAceptar = data.filter(solicitud => solicitud.status != 'Aceptado');
          // console.log(this.solicitudPendienteGerente);
          // console.log(this.solicitudPendienteAceptar);
        }

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

  firmaRelaciones(id: number, accion: number, clave: number){
    this.spinerBandera = !this.spinerBandera;
    console.log(this.cardSolicitud.Dias_disponibles, this.cardSolicitud.cuantos_dias);
    const dias_d = parseInt(this.cardSolicitud.Dias_disponibles) - parseInt(this.cardSolicitud.cuantos_dias);
    const dias_u = parseInt(this.cardSolicitud.Dias_ocupados) + parseInt(this.cardSolicitud.cuantos_dias);
    
    console.log(dias_d, dias_u);

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

  firmarTodoRI(){

   this.spinerFirma = !this.spinerFirma;
   this.api.firmarTodasRI(this.solicitudes).subscribe(
    (response)=>{
            if(response == true){
              const modalElement = document.getElementById('modal-todas');
              if (modalElement) {
                // Usamos el método 'hide' de Bootstrap para cerrar el modal
                // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                this.spinerFirma = !this.spinerFirma;
                this.cargarSolicitudes(this.user[0].Tipo);
              }
            }

    },
    (error)=>{
      console.log('Error: ' + error);

    }
   )

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

  firmarTodoGerente(){

   this.spinerFirma = !this.spinerFirma;
   this.api.firmarTodasGerente(this.solicitudes).subscribe(
    (response)=>{
            if(response == true){
              const modalElement = document.getElementById('modal-todas');
              if (modalElement) {
                // Usamos el método 'hide' de Bootstrap para cerrar el modal
                // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                this.spinerFirma = !this.spinerFirma;
                this.cargarSolicitudes(this.user[0].Tipo);
              }
            }

    },
    (error)=>{
      console.log('Error: ' + error);

    }
   )

  }

  accion(id: number, accion: number){
    if(accion == 0){
      this.spinerBandera = !this.spinerBandera;
    }
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

  generarInhabil(){
    const modalElement = document.getElementById('modal-generar');
    if (modalElement) {
      // Usamos el método 'hide' de Bootstrap para cerrar el modal
      // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
      (window as any).bootstrap.Modal.getInstance(modalElement).hide();
    }
    this.spinerBandera = !this.spinerBandera;
    this.fecha = this.obtenerFechaDeHoy();
    this.fecha_hoy = this.fecha.substring(0,13);
    this.ano_hoy = this.fecha.substring(19,21);
    this.solicitudForm.value.fecha = this.fecha_hoy + ' del 20' + this.ano_hoy;

    this.api.generarInhabil(this.solicitudForm.value).subscribe(
      (response)=>{
        if(response == true){
          this.spinerBandera = !this.spinerBandera;
          this.vaciarFormulario();
          this.alertSuccess = !this.alertSuccess;
          this.alertDanger = false;
          this.cerrarAlerta();
        }
      },
      (error)=>{
        this.alertDanger = !this.alertDanger;
        this.alertSuccess = false;
        this.cerrarAlerta();
        console.error('Error al obtener datos:', error);
      }
    )
  }

  vaciarFormulario(){
    this.solicitudForm.get('cDias')?.setValue('');
    this.solicitudForm.get('fechaApartir')?.setValue('');
    this.solicitudForm.get('fechaHasta')?.setValue('');
    this.solicitudForm.get('motivo')?.setValue('');
  }

  isInvalid(field: string): boolean {
    const control = this.solicitudForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  obtenerFechaDeHoy(): string {
    const hoy = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    return hoy.toLocaleDateString('es-ES', opciones);
  }

  firmarTodo(accion: number){

    if(accion == 1){
      this.spinerFirma = !this.spinerFirma;
    }
    if(accion == 0){
      this.spinerDelete = !this.spinerDelete;
    }
   this.api.accionTodas(this.solicitudes, accion).subscribe(
    (response)=>{
            if(response == true){
              const modalElement = document.getElementById('modal-todas');
              if (modalElement) {
                // Usamos el método 'hide' de Bootstrap para cerrar el modal
                // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                    if(accion == 1){
                      this.spinerFirma = !this.spinerFirma;
                    }
                    if(accion == 0){
                      this.spinerDelete = !this.spinerDelete;
                    }
                this.cargarSolicitudes(this.user[0].Tipo);
              }
            }

    },
    (error)=>{
      console.log('Error: ' + error);

    }
   )

  }

  aceptarTodo(){
    this.spinerFirma = !this.spinerFirma;
    this.api.aceptarTodas(this.solicitudes).subscribe(
      (response)=>{
              if(response == true){
                const modalElement = document.getElementById('modal-todas');
                if (modalElement) {
                  // Usamos el método 'hide' de Bootstrap para cerrar el modal
                  // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                  (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                  this.spinerFirma = !this.spinerFirma;
                  this.cargarSolicitudes(this.user[0].Tipo);
                }
              }

      },
      (error)=>{
        console.log('Error: ' + error);

      }
    )

  }

  async cerrarAlerta(){
    
    setTimeout(() => {
      
      if(this.alertSuccess){
        this.alertSuccess = false;

        // if(this.user[0].Tipo == 'C'){
        //    this.cerrarSesion(1);
        // }
        // if(this.user[0].Tipo == 'S'){
        //   window.location.reload();
        // }

      }
      if(this.alertDanger){
        this.alertDanger = false;
      }
    }, 4000); // 4000 milisegundos = 4 segundos

  }

}
