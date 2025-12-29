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
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { NgClass } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

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

  fechasDeshabilitadas: Date[] = [
    new Date(2025, 10, 1), // 1 de Noviembre de 2025
    new Date(2025, 10, 2), // 2 de Noviembre de 2025
    new Date(2025, 10, 17), // 17 de Noviembre de 2025
    new Date(2025, 11, 12), // 12 de Diciembre de 2025
    new Date(2025, 11, 24), // 24 de Diciembre de 2025
    new Date(2025, 11, 25), // 25 de Diciembre de 2025
    new Date(2026, 0, 1), // 1 de Enero de 2026
    new Date(2026, 1, 2), // 2 de Febrero de 2026
    new Date(2026, 2, 16), // 16 de Marzo de 2026
    new Date(2026, 3, 2), // 2 de Abril de 2026 por la empresa
    new Date(2026, 3, 3), // 3 de Abril de 2026 por la empresa
    new Date(2026, 3, 4), // 4 de Abril de 2026 por la empresa
    new Date(2026, 4, 1), // 1 de Mayo de 2026
    new Date(2026, 4, 10), // 10 de Mayo de 2026 por la empresa
    new Date(2026, 8, 16), // 16 de Septiembre de 2026
    new Date(2026, 10, 1), // 1 de Noviembre de 2026 por la empresa
    new Date(2026, 10, 2), // 2 de Noviembre de 2026 por la empresa
    new Date(2026, 10, 16), // 16 de Noviembre de 2026
    new Date(2026, 11, 12), // 12 de Diciembre de 2026 por la empresa
    new Date(2026, 11, 24), // 24 de Diciembre de 2026 por la empresa
    new Date(2026, 11, 25), // 25 de Diciembre de 2026
    // ... más fechas
  ];

  // Función para deshabilitar las fechas (Método 1)
  filtroFecha = (d: Date | null): boolean => {
    const date = d || new Date();
    // Retorna TRUE si la fecha NO está en la lista de fechasDeshabilitadas
    return !this.fechasDeshabilitadas.some(disabledDate =>
      date.getFullYear() === disabledDate.getFullYear() &&
      date.getMonth() === disabledDate.getMonth() &&
      date.getDate() === disabledDate.getDate()
    );
  };

  // Función para aplicar clases CSS a las fechas
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate || new Date();
      const isDisabled = this.fechasDeshabilitadas.some(disabledDate =>
        date.getFullYear() === disabledDate.getFullYear() &&
        date.getMonth() === disabledDate.getMonth() &&
        date.getDate() === disabledDate.getDate()
      );

      // Aplica la clase 'fecha-deshabilitada' si está deshabilitada
      return {
        'fecha-deshabilitada': isDisabled
      };
    }
    return {};
  };

  @ViewChild('alerToast') alerToast!: ElementRef;

  checkLeyenda: string = '';
  selectOption: string = '';
  alertSuccess: boolean = false;
  alertDanger: boolean = false;
  user: any;
  userFor: any;
  items: any;
  solicitudForm: FormGroup;
  solicitudFormRI: FormGroup;
  fecha_hoy: string = '';
  periodo_anterior: number = 0;
  fecha: any = '';
  ano_hoy: string = '';
  fechaAlta: any = '';
  fecha_ingreso: any = '';
  cumplidos: number = 0;
  dias_diponibles: number = 0;
  dias_diponibles_colaborador: number = 0;

  fechaConversionApartir: string = '';

  colaboradores: any[] = [];
  colaborador: any;
  banderaDias: boolean = false;

  spinerBandera: boolean = false;

  solicitudesUsuario: any[] = [];

  criterio: string = '';

  phoneNumber = '527292805288'; // Reemplaza con el número completo, incluyendo el código de país (sin símbolos ni el signo +)
  message = 'RODRIGUEZ ALVAREZ JOSUE ABRAHAM a solicitado 1 día(s) a partir del 28 de noviembre de 2025 al 28 de noviembre de 2025 con goce de sueldo no sindicalizado.';
  whatsappLink: string = '';

  // periodo: string = '';
  // saldo: number = 0;
  // tomadas: number = 0;

  // regex: string = '^del \d{1,2} al \d{1,2} de [A-Z][a-z]+$';

  // isRotated: boolean = false;

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

  adelantar: boolean = false;
  valorIngresado: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private router: Router, private dialog: MatDialog, private api: ApiServicio, private authservice: LoginServices){
    
    // Codifica el mensaje para la URL
    const encodedMessage = encodeURIComponent(this.message);
    // Construye el enlace usando la estructura recomendada wa.me
    // this.whatsappLink = `https://wa.me/[52][7292805288]?text=${encodedMessage}`;
    // Codifica el mensaje para la URL
    // Construye el enlace usando api.whatsapp.com/send
    this.whatsappLink = `https://api.whatsapp.com/527292805288&text=${encodedMessage}`;
    // https://wa.me/[código_país][número]?text=[mensaje_codificado]

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
      fechaApartir: ['', [Validators.required]],
      fechaHasta: ['', [Validators.required]],
      tipo_solicitud: ['', [Validators.required]],
      // motivo: ['', [Validators.required,]],// Validators.minLength(10)
      motivo: ['', [Validators.required]],
      firma: ['', [Validators.required]],
      clave: ['', []],
      Periodo: ['', []],
      Genera: ['', []],
      Jefe: ['', []]
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

    // Opcional: Suscríbete a valueChanges aquí si necesitas actualizar 'opcionselect' 
    // para el *ngIf del motivo de manera reactiva.
    this.solicitudForm.get('tipo_solicitud')?.valueChanges.subscribe(value => {
      this.opcionselect = value;
    });

    this.checkLeyenda = 'Autorizar';
    this.selectOption = 'Selecciona una opción';
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
    // this.user = this.user[this.user.length - 1];
    // console.log('Ultimo elemento',this.user);
    // this.userFor = this.user;
    this.user = this.user.reverse();
    // this.user = this.user.slice().reverse();
    if(this.user[0].emp_tipo == 'S'){
     this.cargarColaboradores(this.user[0].emp_cve, this.user[0].emp_tipo, this.user[0].emp_reldep, this.user[0].Descripcion);
    //  console.log(this.user[0].Clave)
     this.consultarHistorialColaboradores(this.user[0].Clave);
    }
    // ****************************************************************************************+
    if(this.user[0].emp_tipo == 'JI' && this.user[0].Clave == '300175'){
     this.cargarColaboradores('300175', 'S', 'GLR', this.user[0].Descripcion);
     this.consultarHistorialColaboradores(this.user[0].Clave);
    }

    if(this.user[0].emp_tipo == 'JI' && this.user[0].emp_cve == '300043'){
     this.cargarColaboradores('300043', 'S', 'SCMG', this.user[0].Descripcion);
     this.consultarHistorialColaboradores(this.user[0].Clave);
    }

    if(this.user[0].emp_tipo == 'JI' && this.user[0].emp_cve == '200267'){
     this.cargarColaboradores('200267', 'S', 'GLR', this.user[0].Descripcion);
     this.consultarHistorialColaboradores(this.user[0].Clave);
    }
    // ****************************************************************************************+
    if(this.user[0].emp_tipo == 'RIA'){
     this.cargarColaboradores(this.user[0].emp_cve, this.user[0].emp_tipo, this.user[0].emp_reldep, this.user[0].Descripcion);
          this.consultarHistorialColaboradores(this.user[0].Clave);

    }

    if(this.user[0].emp_tipo == 'C'){
     this.consultarHistorial(this.user[0].Clave);
    }

  
    this.fecha = this.obtenerFechaDeHoy();
    this.fecha_hoy = this.fecha.substring(0,15);
    this.ano_hoy = this.fecha.substring(21,23);
    this.periodo_anterior = parseInt(this.fecha.substring(17,21)) - 1;
    this.fechaAlta = this.formatoFecha(this.user[0].emp_fechin);
    this.fecha_ingreso = this.obtenerFechaAlta(this.user[0].emp_fechin);
    this.cumplidos = this.user[0].Años;
    this.dias_diponibles = this.user[0].Saldo;

    // if(this.user[0].Saldo && this.user[0].Saldo > 0 && !this.user[1].Saldo && !this.user[2]?.Saldo){
    //   this.dias_diponibles = this.user[0].Saldo;
    // }
    // if(this.user[0].Saldo && this.user[0].Saldo > 0 && this.user[1].Saldo && this.user[1].Saldo > 0){
    //   this.dias_diponibles = this.user[1].Saldo;
    // }
    // if(this.user[0].Saldo && this.user[0].Saldo > 0 && this.user[1].Saldo && this.user[1].Saldo > 0 && this.user[2]?.Saldo && this.user[2]?.Saldo > 0){
    //   this.dias_diponibles = this.user[2].Saldo;
    // }

    
    if(this.user[0].Dias_a_disfrutar == '' || this.user[0].Dias_a_disfrutar == null){
      this.user[0].Dias_a_disfrutar = '0';
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

  cargarColaboradores(clave: string, tipo: string, tipo_dep: string, depto: string){

    this.api.getCoAsociados(clave, tipo, tipo_dep, depto).subscribe(data => {
        
        this.colaboradores = data;
        // const opcion = {emp_nom: 'Selecciona colaborador'}
        // this.colaboradores.unshift(opcion);
        this.colaboradores = this.colaboradores.sort((a, b) => b.emp_cve - a.emp_cve);
        this.cdr.detectChanges(); // Fuerza la actualización del DOM
    });

  };

  buscarColaborador(numero: string){
    this.colaborador = this.colaboradores.filter(ele => ele.emp_cve == numero);

  }

  datosCo(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    // console.log(selectElement);
    const selectedValue = selectElement.value;
    // console.log(selectedValue);
    if(selectedValue == ''){
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
        this.colaborador = this.colaboradores.filter(ele => ele.emp_cve+ele.Periodo == selectedValue);
        
        this.fecha_co_hoy = this.obtenerFechaDeHoy().substring(0,15);
        this.ano_co_actual = this.ano_hoy;
        this.nombre_co = selectedValue != '' ? this.colaborador[0].emp_nom : '';
        this.fecha_co_ingreso =  this.obtenerFechaAlta(this.colaborador[0].emp_fechin);
        this.anos_co_cumplidos = this.colaborador[0].Años;
        this.no_tarjeta_co = this.colaborador[0].emp_cve;
        this.dep_co = this.colaborador[0].Descripcion;
        this.centro_co = this.colaborador[0].dep_id;
        
      //   if(parseInt(this.colaborador[0].Dias_disponibles_p2) != 0){
      //     this.dias_diponibles = parseInt(this.colaborador[0].Dias_disponibles) + parseInt(this.colaborador[0].Dias_disponibles_p2)
      //   }
      //  if(parseInt(this.colaborador[0].Dias_disponibles_p2) == 0){
      //     this.dias_diponibles = parseInt(this.colaborador[0].Dias_disponibles)
      //  }
      this.dias_diponibles_colaborador = this.colaborador[0].Saldo;
    }
  }

  // obtenerFechaAlta(fechaISO: string): string {
  //   const fecha = new Date(fechaISO);
  //   const dia = fecha.getDate()+1;
  //   const mes = fecha.toLocaleString('default', { month: 'long' });
  //   const año = fecha.getFullYear();

  //   return `${dia} de ${mes} del ${año}`;
  // }

  obtenerFechaAlta(fechaISO: string): string {
  // Aseguramos que la fecha se interprete en la zona horaria local como el inicio del día
  // agregando una hora de inicio local, o construyéndola por partes.
  // Usaremos una construcción manual para mayor fiabilidad con el formato YYYY-MM-DD.

  const partes = fechaISO.split('-');
  const año = parseInt(partes[0], 10);
  // Los meses en JavaScript van de 0 (enero) a 11 (diciembre), por lo que restamos 1.
  const mesIndex = parseInt(partes[1], 10) - 1;
  const dia = parseInt(partes[2], 10);

  // Creamos la fecha usando new Date(año, mes, dia) para usar la zona horaria local por defecto
  const fecha = new Date(año, mesIndex, dia);

  // Ahora formateamos la fecha correctamente. No necesitamos sumar días.
  const diaFormateado = fecha.getDate();
  const mesFormateado = fecha.toLocaleString('default', { month: 'long' });
  const añoFormateado = fecha.getFullYear();

  return `${diaFormateado} de ${mesFormateado} del ${añoFormateado}`;
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
    // console.log(fechaHoy, fecha_alta);
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
    // console.log(this.cumplidos);
    return this.cumplidos;

  }

  isInvalid(field: string): boolean {
    const control = this.solicitudForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit() {
      // console.log('Solicitud enviada:', this.solicitudForm.value);
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

        if(this.user[0].emp_tipo == 'C'){
           this.cerrarSesion(1);
        }
        if(this.user[0].emp_tipo == 'S' || this.user[0].emp_tipo == 'JI' || this.user[0].emp_tipo == 'RI'){
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

  // valorSelect(event: Event): void {

  //   const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
  //   this.opcionselect = selectElement.value == 'Selecciona una opción'? '' : selectElement.value;
     
  // }

  enviar(){
    this.spinerBandera = !this.spinerBandera;
    this.solicitudForm.value.fecha = this.solicitudForm.value.fecha + ' del 20' + this.solicitudForm.value.año;
    this.solicitudForm.value.firma = this.solicitudForm.value.firma.toString();

    this.solicitudForm.value.fecha = this.fecha_hoy + ' del 20' + this.ano_hoy;
    this.solicitudForm.value.nombre = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.nombre_co : this.user[0].emp_tipo == 'S'? this.nombre_co : this.user[0].emp_tipo == 'RIA'? this.nombre_co : this.user[0].emp_nom;
    this.solicitudForm.value.fechaIngreso = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.fecha_co_ingreso  : this.user[0].emp_tipo == 'S'? this.fecha_co_ingreso : this.user[0].emp_tipo == 'RIA'? this.fecha_co_ingreso : this.fechaAlta;
    this.solicitudForm.value.añosCumplidos = this.cumplidos;
    // this.solicitudForm.value.noTarjeta = this.user[0].emp_cve;
    this.solicitudForm.value.noTarjeta = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.no_tarjeta_co : this.user[0].emp_tipo == 'S'? this.no_tarjeta_co :this.user[0].emp_tipo == 'RIA'? this.colaborador[0].emp_cve : this.user[0].emp_cve;
    this.solicitudForm.value.depto = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.dep_co : this.user[0].emp_tipo == 'S'? this.dep_co : this.user[0].emp_tipo == 'RIA'? this.dep_co : this.user[0].Departamento;
    this.solicitudForm.value.cCostos = this.user[0].dep_id;
    this.solicitudForm.value.fechaApartir = this.converetirFecha(this.solicitudForm.value.fechaApartir);
    this.solicitudForm.value.fechaHasta = this.converetirFecha(this.solicitudForm.value.fechaHasta);
    this.solicitudForm.value.clave = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.no_tarjeta_co : this.user[0].emp_tipo == 'S'? this.no_tarjeta_co : this.user[0].emp_tipo == 'RIA'? this.colaborador[0].emp_cve : this.user[0].Clave;

    this.solicitudForm.value.motivo = this.solicitudForm.value.motivo;
    this.solicitudForm.value.tipo_solicitud = this.opcionselect;

    this.solicitudForm.value.Periodo = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.colaborador[0].Periodo : this.user[0].emp_tipo == 'S'? this.colaborador[0].Periodo : this.user[0].emp_tipo == 'RIA'? this.colaborador[0].Periodo : this.user[0].Periodo;
    this.solicitudForm.value.Genera = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.user[0].emp_cve : this.user[0].emp_tipo == 'S'? this.user[0].emp_cve : this.user[0].emp_cve;
    
    this.solicitudForm.value.Jefe = (this.user[0].emp_cve == '300175' || this.user[0].emp_cve == '200267' || this.user[0].emp_cve == '300043') ? this.colaborador[0].emp_reldep : this.user[0].emp_tipo == 'S'? this.colaborador[0].emp_reldep : this.user[0].emp_reldep;


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

  consultarHistorial(clave: number){
    this.api.getHistorial(clave).subscribe(
      (response) => {
        this.solicitudesUsuario = response;
        this.solicitudesUsuario = this.solicitudesUsuario.map((ele: any)=>{
          ele.fecha_apartir = this.convertirFecha(ele.fecha_apartir);
          ele.fecha_hasta = this.convertirFecha(ele.fecha_hasta);
          return ele;
        });
        const newKey = "isRotated";
        const newValue = false;

        this.solicitudesUsuario.forEach(obj => {
          obj[newKey] = newValue;
        });
        // console.log(this.solicitudesUsuario);

        // 1. Convierte el arreglo a JSON
        const arregloJSON = JSON.stringify(this.solicitudesUsuario);

        // 2. Guarda en localStorage
        localStorage.setItem('misSolicitudes', arregloJSON);
          // console.log(this.solicitudesUsuario);
          // if(response == true){
          //   this.spinerBandera = !this.spinerBandera;
          //   this.vaciarFormulario();
          //   this.alertSuccess = !this.alertSuccess;
          //   this.alertDanger = false;
          //   this.cerrarAlerta();

          // }
         },
         (error) => {
          // this.alertDanger = !this.alertDanger;
          // this.alertSuccess = false;
          // this.cerrarAlerta();
           console.error('Error al obtener datos:', error);
         }

    );

  }

  toggleRotation(solicitud: any) {
    solicitud.isRotated = !solicitud.isRotated;
  }

  recuperarHistorial(periodo: string){
    // console.log(periodo);
    const solicitudesGuardadas = this.user[0].emp_tipo == 'C'? localStorage.getItem('misSolicitudes') : localStorage.getItem('solicitudesColaboradores');
    const solicitudes: any[] = solicitudesGuardadas ? JSON.parse(solicitudesGuardadas) : [];
    // console.log(solicitudes);
    this.solicitudesUsuario = solicitudes.filter((ele: any) =>ele.periodo === periodo);
    // console.log(this.solicitudesUsuario);
  }

  // datosPeriodoSelect(): void {

  //   const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
  //   console.log(selectElement);
  //   const selectedValue = selectElement.value;
  //   console.log(selectedValue);
  //   if(selectedValue == ''){
  //       this.fecha_co_hoy = '';
  //       this.ano_co_actual = '';
  //       this.nombre_co = '';
  //       this.fecha_co_ingreso =  '';
  //       this.anos_co_cumplidos = 0;
  //       this.no_tarjeta_co = '';
  //       this.dep_co = '';
  //       this.centro_co = '';
  //       this.banderaDias = true;
  //   }else{
  //       this.banderaDias = false;
  //       this.colaborador = this.colaboradores.filter(ele => ele.emp_cve+ele.Periodo == selectedValue);
        
  //       this.fecha_co_hoy = this.obtenerFechaDeHoy().substring(0,15);
  //       this.ano_co_actual = this.ano_hoy;
  //       this.nombre_co = selectedValue != '' ? this.colaborador[0].emp_nom : '';
  //       this.fecha_co_ingreso =  this.obtenerFechaAlta(this.colaborador[0].emp_fechin);
  //       this.anos_co_cumplidos = this.obtenerAnosCumplidos(this.formatoFecha(this.colaborador[0].emp_fechin));
  //       this.no_tarjeta_co = this.colaborador[0].emp_cve;
  //       this.dep_co = this.colaborador[0].Descripcion;
  //       this.centro_co = this.colaborador[0].dep_id;
        
  //       this.dias_diponibles = parseInt(this.colaborador[0].Saldo);
  //   }
  // }

  consultarHistorialColaboradores(clave: number){
    this.api.getHistorialColaboradotres(clave).subscribe(
      (response) => {
        this.solicitudesUsuario = response;
        this.solicitudesUsuario = this.solicitudesUsuario.map((ele: any)=>{
          ele.fecha_apartir = this.convertirFecha(ele.fecha_apartir);
          ele.fecha_hasta = this.convertirFecha(ele.fecha_hasta);
          return ele;
        });
        const newKey = "isRotated";
        const newValue = false;

        this.solicitudesUsuario.forEach(obj => {
          obj[newKey] = newValue;
        });
        // console.log(this.solicitudesUsuario);

        // 1. Convierte el arreglo a JSON
        const arregloJSON = JSON.stringify(this.solicitudesUsuario);

        // 2. Guarda en localStorage
        localStorage.setItem('solicitudesColaboradores', arregloJSON);
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }

    );

  }

  // ********************************************************************************************************
    cambiarMensaje(event: any): void {
    const isChecked = event.target.checked;
    
    if (isChecked) {
      // Cuando se firma (activa el checkbox), marcamos todos los campos como inválidos/tocados
      this.markAllFieldsAsTouchedAndDirty(this.solicitudForm);

      if (this.solicitudForm.invalid) {
        // alert('Por favor, completa todos los campos obligatorios antes de firmar.');
        // Opcional: si quieres obligar a completar los campos antes de firmar
        // this.solicitudForm.get('firma')?.setValue(false); 
      }
    } else {
      // Lógica si se desactiva la firma
    }
  }

  // Función de utilidad para marcar todos los controles del formulario
  private markAllFieldsAsTouchedAndDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
      // Si tienes grupos anidados, también se deben marcar
      if (control instanceof FormGroup) {
        this.markAllFieldsAsTouchedAndDirty(control);
      }
    });
  }
  
  // Función auxiliar para usar en la plantilla y verificar si un campo es inválido
  // isInvalid(controlName: string): boolean {
  //   const control = this.solicitudForm.get(controlName);
  //   return !!(control && control.invalid && (control.dirty || control.touched));
  // }

  /**
 * Verifica si los 4 campos de permiso están vacíos/inválidos a la vez.
 * Esto sirve para mostrar un solo mensaje de error general.
 */
  areAllTPermisosInvalid(): boolean {
    // Asegúrate de que todos los controles existan
    const t1 = this.solicitudForm.get('tPermiso1');
    const t2 = this.solicitudForm.get('tPermiso2');
    const t3 = this.solicitudForm.get('tPermiso3');
    const t4 = this.solicitudForm.get('tPermiso4');

    // Retorna verdadero (true) si todos son inválidos (no seleccionados) Y han sido tocados/sucios.
    // Tu función isInvalid ya maneja dirty/touched, así que solo usamos esa función si quieres reutilizarla, 
    // o podemos verificar los valores directamente aquí.

    // Usando tu función isInvalid (que comprueba touched/dirty):
    // return this.isInvalid('tPermiso1') && this.isInvalid('tPermiso2') && this.isInvalid('tPermiso3') && this.isInvalid('tPermiso4');

    // Una forma más directa si solo quieres saber si están vacíos al momento de la firma:
    const allControls = [t1, t2, t3, t4];
    const allEmpty = allControls.every(c => c && !c.value);
    const anyTouched = allControls.some(c => c && (c.touched || c.dirty));

    return allEmpty && anyTouched;
  }
  // ********************************************************************************************************
  adelantarDias(){
    this.adelantar = !this.adelantar;
  }

  adelantarCancelar(){
    this.adelantar = !this.adelantar;
    this.solicitudForm.get('cDias')?.setValue('');
  }

  // Método que se ejecuta con cada cambio en el input
  onInputChange(event: Event): void {
    const valorDelInput = (event.target as HTMLInputElement).value;
    
    // Si el valor está vacío o solo contiene espacios, la variable se pone en false
    this.valorIngresado = valorDelInput.trim().length > 0;
    this.adelantar = false;
    // Opcional: ver el estado en la consola
  }

  // ****************************************************************************************************************

  // ****************************************************************************************************************
}
