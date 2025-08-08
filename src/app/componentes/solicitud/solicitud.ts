import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { ApiServicio } from '../../servicios/api-servicio';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, 
    MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, 
    MatGridListModule, MatIconModule],
  templateUrl: './solicitud.html',
  styleUrl: './solicitud.css'
})
export class Form {

  @ViewChild('alerToast') alerToast!: ElementRef;

  checkLeyenda: string = '';
  selectOption: string = '';
  alertSuccess: boolean = false;
  alertDanger: boolean = false;
  user: any;
  items: any;
  solicitudForm: FormGroup;
  solicitudFormRI: FormGroup;
  fecha_hoy: string = '';
  fecha: any = '';
  ano_hoy: string = '';
  fechaAlta: any = '';
  cumplidos: number = 0;

  fechaConversionApartir: string = '';

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private api: ApiServicio){

    this.solicitudForm = this.fb.group({
      fecha: ['', [Validators.required]],
      año: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      fechaIngreso: ['', [Validators.required]],
      añosCumplidos: ['', [Validators.required]],
      noTarjeta: ['', [Validators.required]],
      depto: ['', [Validators.required]],
      cCostos: ['', [Validators.required]],
      tPermiso1: ['', [Validators.required]],
      tPermiso2: ['', [Validators.required]],
      tPermiso3: ['', [Validators.required]],
      tPermiso4: ['', [Validators.required]],
      cDias: ['', [Validators.required]],
      fechaApartir: ['', []],
      fechaHasta: ['', []],
      motivo: ['', [Validators.required,]],// Validators.minLength(10)
      firma: ['', [Validators.required]],
      clave: ['', []],
    });

    this.solicitudFormRI = this.fb.group({
      contest: ['', [Validators.required]],
      nDias: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      firmaRI: ['', [Validators.required]]
    });
    
  }

  ngOnInit(){
    this.checkLeyenda = 'Autorizar';
    this.selectOption = 'Selecciona una opción';
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    console.log('Usuario: ', this.user);
    this.fecha = this.obtenerFechaDeHoy();
    this.fecha_hoy = this.fecha.substring(0,12);
    this.ano_hoy = this.fecha.substring(18,20);
    console.log(this.fecha);
    // console.log(this.user[0].Fecha_alta.substring(6,10));
    // this.cumplidos = this.obtenerAnosCumplidos(this.user[0].Fecha_alta);
    // console.log(this.cumplidos);
    this.fechaAlta = this.obtenerFechaAlta(this.user[0].Fecha_de_alta);
    this.obtenerAnosCumplidos(this.user[0].Fecha_de_alta);
    // this.formatCustomDate();
    
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

  obtenerFechaAlta(fecha: string){
    const dia = fecha.substring(0,2);
    const mes = fecha.substring(3,5) == '01' ? 'enero' 
    : fecha.substring(3,5) == '02' ? 'febrero' 
    : fecha.substring(3,5) == '03' ? 'marzo'
    : fecha.substring(3,5) == '04' ? 'abril'
    : fecha.substring(3,5) == '05' ? 'mayo'
    : fecha.substring(3,5) == '06' ? 'junio'
    : fecha.substring(3,5) == '07' ? 'julio'
    : fecha.substring(3,5) == '08' ? 'agosto'
    : fecha.substring(3,5) == '09' ? 'septiembre'
    : fecha.substring(3,5) == '10' ? 'octubre'
    : fecha.substring(3,5) == '11' ? 'noviembre'
    : fecha.substring(3,5) == '12' ? 'diciembre' : 'Otro Mes';
    const año = fecha.substring(6,10);
    const fechaAlta = dia + ' de ' + mes + ' del ' + año;
    return fechaAlta;
  }

  formatCustomDate(){
    var date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formatoFechaHoy = day + '/' + month +'/' + year;
    return formatoFechaHoy;
  }


  obtenerAnosCumplidos(fecha_alta: string){
    const fechaHoy = this.formatCustomDate();
    const fechaAlta = fecha_alta;
    console.log('fecha hoy:', fechaHoy, 'fecha alta:', fechaAlta);
    const diaH = parseInt(fechaHoy.substring(0,2));
    const mesH = parseInt(fechaHoy.substring(3,5));
    const añoH = parseInt(fechaHoy.substring(6,10));
    const diaA = parseInt(fechaAlta.substring(0,2));
    const mesA = parseInt(fechaAlta.substring(3,5));
    const añoA = parseInt(fechaAlta.substring(6,10));

    this.cumplidos = añoH - añoA;
    console.log(diaA, diaH)

    if(diaH >= diaA){
      this.cumplidos = this.cumplidos;
      console.log('Entro');
    }else{
      this.cumplidos = this.cumplidos - 1;
      console.log('Entro');
    }
    if(añoA == añoH){
      this.cumplidos = 0;
    }

  }

  // convertirFecha(fecha: any){
  //   // const fecha = this.solicitudForm.value.fechaApartir;
  //   console.log(fecha);
  //   const opciones: Intl.DateTimeFormatOptions = {
  //     day: '2-digit',
  //     month: 'long',
  //     year: 'numeric'
  //   };
  //   this.fechaConversionApartir = fecha.toLocaleDateString('es-ES', opciones);
  //   console.log(this.fechaConversionApartir);

  //   // return this.fechaConversionApartir;

  // }

  // onDateChange(event: any) {
  //      const selectedDate = event.value;
  //      console.log(selectedDate);
  //      // Llama a tu función aquí con el selectedDate
  //      this.convertirFecha(selectedDate);
  //   }

  isInvalid(field: string): boolean {
    const control = this.solicitudForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
      console.log('Solicitud enviada:', this.solicitudForm.value);
      // Aquí iría la lógica de envío (API, backend, etc.)
  }

  cambiarLeyenda(event: MouseEvent) {
    const input = event.target as HTMLInputElement;
    console.log('Evento:', event);

    if (input.checked == true) {
      this.checkLeyenda = 'Autorizado';
    }
    if (input.checked == false) {
      this.checkLeyenda = 'Autorizar';
    }
  }

  async cerrarAlerta(){
    setTimeout(() => {
      console.log('Mensaje despúes de 4 segundos.');
      if(this.alertSuccess){
        this.alertSuccess = false;
        this.cerrarSesion(1);
      }
      if(this.alertDanger){
        this.alertDanger = false;
      }
    }, 4000); // 4000 milisegundos = 4 segundos

  }


  cerrarSesion(accion: number){
    if(accion == 0){
      const res = confirm('Seguro que quieres cerrar la sesión?');
      if(res){
        localStorage.removeItem('Usuario');
        this.router.navigate(['login']);
      }else{
        return;
      }
    }
    if(accion == 1){
        localStorage.removeItem('Usuario');
        this.router.navigate(['login']);
    }
    
  }

  abrirAlerta() {
        const dialogRef = this.dialog.open(Cerrarsesion, {
          width: '500px',
          height: '150px',
          disableClose: false, // true para que no se cierre al hacer clic fuera
        });
  }

   converetirFecha(fecha: Date): string {
    const hoy = fecha;
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    return hoy.toLocaleDateString('es-ES', opciones);
  }

  enviar(){
    // console.log('Formulario:',this.solicitudForm.value.fecha);
    this.solicitudForm.value.fecha = this.solicitudForm.value.fecha + ' del 20' + this.solicitudForm.value.año;
    this.solicitudForm.value.firma = this.solicitudForm.value.firma.toString();
    // this.solicitudForm.value.tPermiso = this.solicitudForm.value.tPermiso1 == true? 'Con goce de sueldo' : this.solicitudForm.value.tPermiso2 == true? 'Sin goce de sueldo' : this.solicitudForm.value.tPermiso3 == true? 'Sindicalizado' : this.solicitudForm.value.tPermiso4 == true? 'No sindicalizado' : '';

    this.solicitudForm.value.fecha = this.fecha_hoy + ' del 20' + this.ano_hoy;
    this.solicitudForm.value.nombre = this.user[0].Nombre_completo;
    this.solicitudForm.value.fechaIngreso = this.fechaAlta;
    this.solicitudForm.value.añosCumplidos = this.cumplidos;
    this.solicitudForm.value.noTarjeta = this.user[0].No_Tarjeta;
    this.solicitudForm.value.depto = this.user[0].Departamento;
    this.solicitudForm.value.cCostos = this.user[0].Centro_costos;
    this.solicitudForm.value.fechaApartir = this.converetirFecha(this.solicitudForm.value.fechaApartir);
    this.solicitudForm.value.fechaHasta = this.converetirFecha(this.solicitudForm.value.fechaHasta);
    this.solicitudForm.value.clave = this.user[0].Clave;

    // console.log('fecha:', this.solicitudForm.value.fecha);

    this.api.form(this.solicitudForm.value).subscribe(
      (response) => {
          if(response == true){
            this.vaciarFormulario();
            this.alertSuccess = !this.alertSuccess;
            this.alertDanger = false;
            this.cerrarAlerta();

          }
         },
         (error) => {
          this.alertDanger = !this.alertDanger;
          this.alertSuccess = false;
          this.cerrarAlerta();
           console.error('Error al obtener datos:', error);
         }

    );

    // this.api.form(this.user).subscribe(
    //      (response) => {
    //       const data = response; // Asigna los datos recibidos a la variable 'data'
    //       console.log("Mensaje: ", data);
    //      },
    //      (error) => {
    //        console.error('Error al obtener datos:', error);
    //      }
    // );
  }

  vaciarFormulario(){
    this.solicitudForm.get('fecha')?.setValue('');
    this.solicitudForm.get('año')?.setValue('');
    this.solicitudForm.get('nombre')?.setValue('');
    this.solicitudForm.get('fechaIngreso')?.setValue('');
    this.solicitudForm.get('añosCumplidos')?.setValue('');
    this.solicitudForm.get('noTarjeta')?.setValue('');
    this.solicitudForm.get('depto')?.setValue('');
    this.solicitudForm.get('cCostos')?.setValue('');
    this.solicitudForm.get('tPermiso')?.setValue('Selecciona una opción');
    this.solicitudForm.get('cDias')?.setValue('');
    this.solicitudForm.get('fechaApartir')?.setValue('');
    this.solicitudForm.get('fechaHasta')?.setValue('');
    this.solicitudForm.get('motivo')?.setValue('');
    this.solicitudForm.get('firma')?.setValue(0);
  }

}
