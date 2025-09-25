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
import { Colaborador } from '../../interfaces/colaborador';
import { LoginServices } from '../../servicios/login';


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
  dias_diponibles: number = 0;

  fechaConversionApartir: string = '';

  colaboradores: any[] = [];
  colaborador: any;
  banderaDias: boolean = false;

  spinerBandera: boolean = false;

  //////////////////// Datos colaborador ////////////////////////
  fecha_co_hoy: string = '';
  ano_co_actual: string = '';
  nombre_co: string = '';
  fecha_co_ingreso: string = '';
  anos_co_cumplidos: number = 0;
  no_tarjeta_co: string = '';
  dep_co: string = '';
  centro_co: string = '';
  opcionselect: string = '';
  ///////////////////////////////////////////////////////////////

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private api: ApiServicio, private authservice: LoginServices){

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
      tipo_solicitud: ['', []],
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

    this.colaborador = {
       Apellido_materno: '',
    Apellido_paterno: '',
    CURP: '',
    Clave: 0,
    Contraseña: '',
    Departamento: '',
    Dias_disponibles: '',
    Dias_ocupados: '',
    Dias_vacaciones: '',
    Estatus: '',
    Estatus_Solicitud: '',
    Fecha_de_alta: '',
    Fecha_de_baja: '',
    Fecha_de_nacimiento: '',
    Nombre: '',
    Nombre_completo: '',
    Puesto: '',
    RFC: '',
    Sexo: '',
    Tipo: '',
    Tipo_Dep: '',
    Usuario: '',
    }
    
  }

  ngOnInit(){
    this.checkLeyenda = 'Autorizar';
    this.selectOption = 'Selecciona una opción';
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    if(this.user[0].Tipo == 'S' && this.user[0].Tipo_Dep == 'Ref'){
     this.cargarColaboradores(this.user[0].Tipo, this.user[0].Tipo_Dep);
    }

  
    this.fecha = this.obtenerFechaDeHoy();
    this.fecha_hoy = this.fecha.substring(0,16);
    this.ano_hoy = this.fecha.substring(22,24);
    this.fechaAlta = this.obtenerFechaAlta(this.user[0].Fecha_de_alta);
    this.obtenerAnosCumplidos(this.fechaAlta);
    if(parseInt(this.user[0].Dias_disponibles) == 0){
      this.dias_diponibles = parseInt(this.user[0].Dias_vacaciones);
    }else{
      this.dias_diponibles = parseInt(this.user[0].Dias_disponibles)
    }
    
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

   obtenerFechaAltaFormato(fecha: Date){
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };

    return fecha.toLocaleDateString('es-ES', opciones);
  }

  cargarColaboradores(tipo: string, tipo_dep: string){

    this.api.getCoAsociados(tipo, tipo_dep).subscribe(data => {
        
        this.colaboradores = data;
        const opcion = {Nombre_completo: 'Selecciona colaborador'}
        this.colaboradores.unshift(opcion);
    });

  };

  datosCo(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    const selectedValue = selectElement.value;

    if(selectedValue == 'Selecciona colaborador'){
        this.fecha_co_hoy = '';
        this.ano_co_actual = '';
        this.nombre_co = '';
        this.fecha_co_ingreso =  '';
        this.anos_co_cumplidos = 0;
        this.no_tarjeta_co = '';
        this.dep_co = '';
        this.centro_co = '';
        this.banderaDias = true;
    }else{
      this.banderaDias = false;
        this.colaborador = this.colaboradores.filter(ele => ele.Nombre_completo == selectedValue);
        
        this.fecha_co_hoy = this.obtenerFechaDeHoy().substring(0,16);
        this.ano_co_actual = '25';
        this.nombre_co = this.colaborador[0].Nombre_completo;
        this.fecha_co_ingreso =  this.obtenerFechaAlta(this.colaborador[0].Fecha_de_alta);;
        this.anos_co_cumplidos = this.obtenerAnosCumplidos(this.formatoFecha(this.colaborador[0].Fecha_de_alta));
        this.no_tarjeta_co = this.colaborador[0].Clave;
        this.dep_co = this.colaborador[0].Departamento;
        this.centro_co = '106';
        this.dias_diponibles = parseInt(this.colaborador[0].Dias_disponibles);
    }
  }

  obtenerFechaAlta(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate()+1;
    const mes = fecha.toLocaleString('default', { month: 'long' });
    const año = fecha.getFullYear();

    return `${dia} de ${mes} del ${año}`;
  }

  formatoFecha(fecha: string){
    var date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formatoFechaHoy = day + '/' + month +'/' + year;
    return formatoFechaHoy;
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
   
    const diaH = parseInt(fechaHoy.substring(0,2));
    const mesH = parseInt(fechaHoy.substring(3,5));
    const añoH = parseInt(fechaHoy.substring(6,10));
    const diaA = parseInt(fechaAlta.substring(0,2));
    const mesA = parseInt(fechaAlta.substring(3,5));
    const añoA = parseInt(fechaAlta.substring(6,10));

    this.cumplidos = añoH - añoA;
   

    if(diaH >= diaA && mesH >= mesA){
      this.cumplidos = this.cumplidos;
    }

    if(diaH >= diaA && mesH < mesA){
      this.cumplidos = this.cumplidos - 1;
    }
  
    if(añoA == añoH){
      this.cumplidos = 0;
    }

    return this.cumplidos;

  }

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
    

    if (input.checked == true) {
      this.checkLeyenda = 'Autorizado';
    }
    if (input.checked == false) {
      this.checkLeyenda = 'Autorizar';
    }
  }

  async cerrarAlerta(){
    
    setTimeout(() => {
      
      if(this.alertSuccess){
        this.alertSuccess = false;

        if(this.user[0].Tipo == 'C'){
           this.cerrarSesion(1);
        }
        if(this.user[0].Tipo == 'S'){
          window.location.reload();
        }

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
        this.authservice.logout();
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

  valorSelect(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    this.opcionselect = selectElement.value == 'Selecciona una opción'? '' : selectElement.value;
     
  }

  enviar(){
    this.spinerBandera = !this.spinerBandera;
    this.solicitudForm.value.fecha = this.solicitudForm.value.fecha + ' del 20' + this.solicitudForm.value.año;
    this.solicitudForm.value.firma = this.solicitudForm.value.firma.toString();

    this.solicitudForm.value.fecha = this.fecha_hoy + ' del 20' + this.ano_hoy;
    this.solicitudForm.value.nombre = this.user[0].Tipo == 'S'? this.nombre_co : this.user[0].Nombre_completo;
    this.solicitudForm.value.fechaIngreso = this.user[0].Tipo == 'S'? this.fecha_co_ingreso : this.fechaAlta;
    this.solicitudForm.value.añosCumplidos = this.cumplidos;
    this.solicitudForm.value.noTarjeta = this.user[0].No_Tarjeta;
    this.solicitudForm.value.depto = this.user[0].Tipo == 'S'? this.dep_co : this.user[0].Departamento;
    this.solicitudForm.value.cCostos = this.user[0].Centro_costos;
    this.solicitudForm.value.fechaApartir = this.converetirFecha(this.solicitudForm.value.fechaApartir);
    this.solicitudForm.value.fechaHasta = this.converetirFecha(this.solicitudForm.value.fechaHasta);
    this.solicitudForm.value.clave = this.user[0].Tipo == 'S'? this.no_tarjeta_co : this.user[0].Clave;

    this.solicitudForm.value.motivo = this.solicitudForm.value.motivo;
    this.solicitudForm.value.tipo_solicitud = this.opcionselect;

    this.api.form(this.solicitudForm.value).subscribe(
      (response) => {
          if(response == true){
            this.spinerBandera = !this.spinerBandera;
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
