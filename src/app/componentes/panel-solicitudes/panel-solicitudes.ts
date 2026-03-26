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
import { Form } from '../solicitud/solicitud';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { PanelControlVac } from '../panel-control-vac/panel-control-vac';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-panel-solicitudes',
  standalone: true,
  imports: [CommonModule, PanelReportes, PanelControlVac, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, 
    MatGridListModule, MatIconModule, ReactiveFormsModule, FormsModule, Form],
  templateUrl: './panel-solicitudes.html',
  styleUrl: './panel-solicitudes.css'
})
export class PanelSolicitudes {

  @ViewChild('inicioPicker') picker!: MatDatepicker<Date>;
  selectedDates: Date[] = [];
  fechasOrdenadas: any[] = [];

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
  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   if (view === 'month') {
  //     const date = cellDate || new Date();
  //     const isDisabled = this.fechasDeshabilitadas.some(disabledDate =>
  //       date.getFullYear() === disabledDate.getFullYear() &&
  //       date.getMonth() === disabledDate.getMonth() &&
  //       date.getDate() === disabledDate.getDate()
  //     );

  //     // Aplica la clase 'fecha-deshabilitada' si está deshabilitada
  //     return {
  //       'fecha-deshabilitada': isDisabled
  //     };
  //   }
  //   return {};
  // };


  @ViewChild('miCheckboxRI') miCheckboxRI!: ElementRef;
  @ViewChild('miCheckboxJI') miCheckboxJI!: ElementRef;
  @ViewChild('miCheckboxG') miCheckboxG!: ElementRef;
  @ViewChild('alerToast') alerToast!: ElementRef;

  solicitudes: any;
  solicitudes_listas: any;
  ausentes: any;
  cardSolicitud: any;
  user: any;
  firmaCheck: boolean =  false;
  spinerBandera: boolean = false;
  spinerFirma: boolean = false;
  spinerDelete: boolean = false;
  
  banderaDash: boolean = true;
  banderaReporte: boolean = false;
  banderaControl: boolean = false;
  banderaSolicitud: boolean = false;
  banderaCrearSolicitud: boolean = false;
  banderaDia: boolean = false;

  solicitudForm: FormGroup;

  fecha_hoy: string = '';
  fecha: any = '';
  ano_hoy: string = '';

  arregloClaves: any[] = [];
  alertSuccess: boolean = false;
  alertDanger: boolean = false;

  solicitudPendienteJefe: any[] = [];
  solicitudPendienteAceptar: any[] = [];

  colaboradores: any[] = [];

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
    this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
    
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

  cambiarDash(){
    this.banderaDash = true;
    this.banderaReporte = false;
    this.banderaControl = false;
    this.banderaSolicitud = false;
    this.banderaCrearSolicitud = false;
    this.banderaDia = false;
    this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
  }

  cambiarReporte(){
    this.banderaReporte = true;
    this.banderaDash = false;
    this.banderaControl = false;
    this.banderaSolicitud = false;
    this.banderaCrearSolicitud = false;
    this.banderaDia = false;
  }

    cambiarControl(){
    this.banderaControl = true;
    this.banderaReporte = false;
    this.banderaDash = false;
    this.banderaSolicitud = false;
    this.banderaCrearSolicitud = false;
    this.banderaDia = false;
  }

  cambiarSolicitud(){
    this.banderaSolicitud = true;
    this.banderaReporte = false;
    this.banderaControl = false;
    this.banderaDash = false;
    this.banderaCrearSolicitud = false;
    this.banderaDia = false;
  }

  crearSolicitud(){
    this.banderaCrearSolicitud = true;
    this.banderaSolicitud = false;
    this.banderaReporte = false;
    this.banderaControl = false;
    this.banderaDash = false;
    this.banderaDia = false;
  }
  
  cambiarDia(){
    this.banderaDia = true;
    this.banderaReporte = false;
    this.banderaControl = false;
    this.banderaSolicitud = false;
    this.banderaCrearSolicitud = false;
    this.banderaDash = false;
    this.consultaGeneralControlVacaciones();
  }

  consultaGeneralControlVacaciones(){
    this.api.consultarControl().subscribe(
      (res)=>{
          this.colaboradores = res;
      },
      (err)=>{
          console.log('Error al cargar lista de colaboradores: ',err);
      }
    )
  }

  // +++++++++++++++++++++++++ Seleccion en lista de colaboradores con Día Inhabil +++++++++++++++++++++++++++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  seleccionados: any[] = [];
  contador: number = 0;

  toggleSeleccion(colab: any, event: any) {
    const checked = event.target.checked;
    
    if (checked) {
      this.seleccionados.push(colab);
      console.log(this.seleccionados)
    } else {
        this.seleccionados = this.seleccionados.filter(s => !(s.Clave === colab.Clave && s.Periodo === colab.Periodo));
      console.log(this.seleccionados)
    }
    this.actualizarContador();
  }

  seleccionarTodos(event: any) {
    const checked = event.target.checked;
    if (checked) {
      // Clonamos el arreglo para evitar referencias directas
      this.seleccionados = [...this.colaboradores];
    } else {
      this.seleccionados = [];
    }
    this.actualizarContador();
  }

  private actualizarContador() {
    this.contador = this.seleccionados.length;
  }

  isSeleccionado(clave: string, periodo: string): boolean {
    return this.seleccionados.some(c => c.Clave === clave && c.Periodo === periodo);
  }

  onDateChange(event: any): void {
  const date = event.value;
  if (!date) return;

  // Normalizamos la fecha a medianoche para una comparación exacta
  const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const index = this.selectedDates.findIndex(d => 
    d.getTime() === selectedDate.getTime()
  );

  if (index >= 0) {
    // ELIMINAR: Si ya estaba en el arreglo, la quitamos
    this.selectedDates.splice(index, 1);
    // console.log(this.selectedDates);
    this.fechasOrdenadas = this.ordenarYFormatearFechas(this.selectedDates);
    // console.log(this.fechasOrdenadas);
  } else {
    // AGREGAR: Si no estaba, la incluimos
    this.selectedDates.push(selectedDate);
    // console.log(this.selectedDates);
    this.fechasOrdenadas = this.ordenarYFormatearFechas(this.selectedDates);
    // console.log(this.fechasOrdenadas);
  }

  // 1. Forzar cambio de referencia para que Angular detecte cambios
  this.selectedDates = [...this.selectedDates];

  // 2. Limpiar el input para permitir volver a seleccionar la misma fecha inmediatamente
  this.solicitudForm.get('fechaApartir')?.setValue(null, { emitEvent: false });

  // 3. REFRESCO VISUAL INMEDIATO:
  // Accedemos a la instancia del calendario dentro del picker para forzar el repintado
  const calendarInstance = (this.picker as any)._componentRef?.instance._calendar;
  if (calendarInstance) {
    calendarInstance.updateTodaysDate(); // Esto vuelve a ejecutar dateClass y quita/pone el CSS
  }

  // Mantener el panel abierto
  setTimeout(() => this.picker.open());
}

  ordenarYFormatearFechas(fechas: Date[]): string[] {
  return fechas
    // 1. Ordenar cronológicamente (de menor a mayor)
    .sort((a, b) => a.getTime() - b.getTime())
    // 2. Transformar a formato "YYYY-MM-DD"
    .map(fecha => {
      const anio = fecha.getFullYear();
      // getMonth() es 0-indexado, sumamos 1 y rellenamos con '0' a la izquierda
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');
      
      return `${anio}-${mes}-${dia}`;
    });
  }

    // Tu función combinada de antes
  dateClass = (cellDate: Date) => {
    const isSelected = this.selectedDates.some(d => d.getTime() === cellDate.getTime());
    const isDisabled = this.fechasDeshabilitadas.some(d => d.getTime() === cellDate.getTime());

    return {
      'custom-selected-date': isSelected,
      'fecha-deshabilitada': isDisabled
    };
  };

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

  cargarSolicitudes(tipo: string, rel_dep: string){
    this.api.getSolicitudes(tipo, rel_dep).subscribe(data => {
      // console.log(data);
      if(data){
        this.solicitudes = data.filter(solicitud => solicitud.status != 'Ausente');
      
        // console.log(this.solicitudes);
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
        if(this.user[0].emp_tipo == 'RI'){
          this.solicitudPendienteJefe = data.filter(solicitud => solicitud.firma_jefe_in == '');
          this.solicitudPendienteAceptar = data.filter(solicitud => solicitud.status == 'Pend. X Jefe Inm.');
        }

        this.cardSolicitud =  this.solicitudes[0];
        // console.log(this.cardSolicitud);
        // const tipoSolicitud = this.cardSolicitud.motivo.includes('Permiso')? 'Permiso' : this.cardSolicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
        // this.cardSolicitud = Object.assign({tipoSolicitud: tipoSolicitud}, this.cardSolicitud);
      }
        // this.cardSolicitud.motivo = tipoSolicitud == 'Vacaciones'? this.cardSolicitud.motivo.substring(12,500) : tipoSolicitud == 'Permiso'? this.cardSolicitud.motivo.substring(9,500) : tipoSolicitud == 'Pago tiempo por tiempo'? this.cardSolicitud.motivo.substring(24,500) : this.cardSolicitud.motivo;

    });
  }

  activarFirma(id: number){
    this.spinerFirma = !this.spinerFirma;
    this.api.aceptarRI(id).subscribe(
      (response) => {
          if(response == true){
            
            // console.log('Se autorizó la firma de RI');
            this.spinerFirma = !this.spinerFirma;
            this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
           
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );
  }

  firmaRelaciones(id: number, accion: number, clave: number, tipo: string){
    this.spinerBandera = !this.spinerBandera;
    // console.log(this.cardSolicitud.Dias_disponibles, this.cardSolicitud.cuantos_dias);
    // const dias_d = parseInt(this.cardSolicitud.Dias_disponibles) - parseInt(this.cardSolicitud.cuantos_dias);
    // const dias_u = parseInt(this.cardSolicitud.Dias_ocupados) + parseInt(this.cardSolicitud.cuantos_dias);

    var dias_d: number = 0;
    var dias_u: number = 0;
    var dias_ant: number = 0;
    var periodo: string = '';
    var correo: string = '';
    var nombre: string = '';
    var genera: string = '';

   if(tipo == 'Vacaciones'){
      dias_d = this.cardSolicitud.Saldo - parseInt(this.cardSolicitud.cuantos_dias);
      dias_u = this.cardSolicitud.Vacaciones_tomadas + parseInt(this.cardSolicitud.cuantos_dias);
   }else{
      dias_d = this.cardSolicitud.Saldo;
      dias_u = this.cardSolicitud.Vacaciones_tomadas;
   }
    periodo = this.cardSolicitud.Periodo;
    correo = this.cardSolicitud.emp_mail;
    nombre = this.cardSolicitud.Nombre;
    genera = this.cardSolicitud.genera;
    
    // console.log(this.cardSolicitud, dias_d, dias_u);
    // if(this.cardSolicitud.Dias_disponibles_p2 != 0 || this.cardSolicitud.Dias_disponibles_p2 == this.cardSolicitud.cuantos_dias.toString()){
    //   dias_d = parseInt(this.cardSolicitud.Dias_disponibles_p2) - parseInt(this.cardSolicitud.cuantos_dias);
    //   dias_u = parseInt(this.cardSolicitud.Dias_ocupados_p2) + parseInt(this.cardSolicitud.cuantos_dias);
    //   periodo = 'anterior';
    // }
    // if(this.cardSolicitud.Dias_disponibles_p2 == 0){
    //   dias_d = parseInt(this.cardSolicitud.Dias_disponibles) - parseInt(this.cardSolicitud.cuantos_dias);
    //   dias_u = parseInt(this.cardSolicitud.Dias_ocupados) + parseInt(this.cardSolicitud.cuantos_dias);
    //   periodo = 'actual';
    // }
    // if(parseInt(this.cardSolicitud.Dias_disponibles_p2) < parseInt(this.cardSolicitud.cuantos_dias)){
    //   dias_ant = parseInt(this.cardSolicitud.Dias_disponibles_p2) - parseInt(this.cardSolicitud.cuantos_dias);
    //   // console.log(dias_ant);
    //   const num_restar = Math.abs(dias_ant);
    //   dias_d = parseInt(this.cardSolicitud.Dias_disponibles) + dias_ant;//el signo (+) es para que reste y no sume ya que dias_ant es negativo
    //   dias_u = parseInt(this.cardSolicitud.Dias_ocupados) - dias_ant;//el signo (-) es para que sume y no reste ya que dias_ant es negativo
    //   periodo = 'ambos';
    // }
    
    // console.log(dias_d, dias_u);

    this.api.aprobar(id, accion, dias_d, dias_u, clave, periodo, correo, nombre, genera).subscribe(
      (response) => {
          if(response == true){
            const modalElement = document.getElementById('modal');
            if (modalElement) {
              // Usamos el método 'hide' de Bootstrap para cerrar el modal
              // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
              (window as any).bootstrap.Modal.getInstance(modalElement).hide();
              this.spinerBandera = !this.spinerBandera;
            }
            this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
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
// -------------------------------------------------------------------------------------------------------------------------->

   this.api.firmarTodasRI(this.solicitudes).subscribe(
    (response)=>{
            if(response == true){
              const modalElement = document.getElementById('modal-todas');
              if (modalElement) {
                // Usamos el método 'hide' de Bootstrap para cerrar el modal
                // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
                (window as any).bootstrap.Modal.getInstance(modalElement).hide();
                this.spinerFirma = !this.spinerFirma;
                this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
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
            this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
            // this.miCheckboxJI.nativeElement.checked = false;
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );

  }

  // firmaGerente(solicitud: any){
  //   this.spinerBandera = !this.spinerBandera;
  //   this.api.firmaGerente(solicitud).subscribe(
  //     (response) => {
  //         if(response == true){
  //           const modalElement = document.getElementById('modal');
  //           if (modalElement) {
  //             // Usamos el método 'hide' de Bootstrap para cerrar el modal
  //             // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
  //             (window as any).bootstrap.Modal.getInstance(modalElement).hide();
  //             this.spinerBandera = !this.spinerBandera;
  //           }
  //           this.cargarSolicitudes(this.user[0].Tipo);
  //           // this.miCheckboxG.nativeElement.checked = false;
  //         }
  //        },
  //        (error) => {
  //          console.error('Error al obtener datos:', error);
  //        }
  //   );

  // }

  // firmarTodoGerente(){

  //  this.spinerFirma = !this.spinerFirma;
  //  this.api.firmarTodasGerente(this.solicitudes).subscribe(
  //   (response)=>{
  //           if(response == true){
  //             const modalElement = document.getElementById('modal-todas');
  //             if (modalElement) {
  //               // Usamos el método 'hide' de Bootstrap para cerrar el modal
  //               // Asegúrate de que Bootstrap esté correctamente incluido en tu proyecto
  //               (window as any).bootstrap.Modal.getInstance(modalElement).hide();
  //               this.spinerFirma = !this.spinerFirma;
  //               this.cargarSolicitudes(this.user[0].Tipo);
  //             }
  //           }

  //   },
  //   (error)=>{
  //     console.log('Error: ' + error);

  //   }
  //  )

  // }

  accion(id: number, accion: number){
    // console.log(accion);
    if(accion == 0){
      this.spinerBandera = !this.spinerBandera;
    }
    const dias_d = this.solicitudes[0].Saldo - parseInt(this.solicitudes[0].cuantos_dias);
    const dias_u = this.solicitudes[0].Vacaciones_tomadas + parseInt(this.solicitudes[0].cuantos_dias);
    const clave = this.solicitudes[0].Clave;
    const correo = this.solicitudes[0].emp_mail;
    const periodo = this.solicitudes[0].Periodo;
    const nombre = this.solicitudes[0].Nombre;
    const genera = this.solicitudes[0].genera;
    

    this.api.aprobar(id, accion, dias_d, dias_u, clave, periodo, correo, nombre, genera).subscribe(
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
       
            this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
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
    this.fecha_hoy = this.fecha.substring(0,15);
    this.ano_hoy = this.fecha.substring(21,23);
    this.solicitudForm.value.cDias = this.fechasOrdenadas.length;
    this.solicitudForm.value.fecha = this.fecha;
    this.solicitudForm.value.fechaApartir = this.fechasOrdenadas[0];
    this.solicitudForm.value.fechaHasta = this.fechasOrdenadas.length == 1 ? this.fechasOrdenadas[0] : this.fechasOrdenadas.length > 1 ? this.fechasOrdenadas[this.fechasOrdenadas.length - 1] : this.fechasOrdenadas[0];


    this.api.generarInhabil(this.solicitudForm.value, this.seleccionados).subscribe(
      (response)=>{
        if(response == true){
          this.spinerBandera = !this.spinerBandera;
          this.vaciarFormulario();
          this.actualizarContador();
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
    this.selectedDates = [];
    this.seleccionados = [];
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
                this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
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
                  this.cargarSolicitudes(this.user[0].emp_tipo, this.user[0].emp_reldep);
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
