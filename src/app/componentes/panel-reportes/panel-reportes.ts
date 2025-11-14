import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiServicio } from '../../servicios/api-servicio';
import * as XLSX from 'xlsx';
import { LoginServices } from '../../servicios/login';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// (pdfMake as any).vfs = pdfFonts;
// (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;





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
  solicitudesFilter: any;
  nDias: number = 0;
  reporte_solicitudes: any[] = [];

  depto: string = '';
  anio: string = '';
  mes: string = '';

  datosColaborador: any[] = [];
  fecha: any;;
  
  constructor(private dialog: MatDialog, private router: Router, private fb: FormBuilder,
     private api: ApiServicio, private loginServices: LoginServices){

    this.consultaForm = this.fb.group({
      criterio: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
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

  descargarExcel(){

      this.solicitudes.map((ele: any)=> {
        const solicitud = {
          Clave: ele.Clave,
          Nombre: ele.Nombre,
          Departamento: ele.Departamento,
          // Puesto: ele.Puesto,
          Fecha_de_ingreso: ele.Fecha_ingreso,
          Estatus: ele.Estatus,
          Fecha_solicitud: ele.fecha_solicitud,
          Por_cuantos_dias: ele.cuantos_dias,
          Del: ele.fecha_apartir,
          Al: ele.fecha_hasta,
          Motivo: ele.motivo,
          Estatus_solicitud: ele.status
        }
        this.reporte_solicitudes.push(solicitud);
      })

      // 1. Convierte los datos en un formato de hoja de cálculo
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reporte_solicitudes);

      // 2. Crea un nuevo libro de trabajo y añade la hoja de cálculo
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos'); // 'Datos' es el nombre de la hoja
      this.fecha = this.obtenerFechaDeHoy();
      // 3. Genera y descarga el archivo XLSX
      const nombreArchivo = 'reporte_'+this.fecha+'.xlsx';
      XLSX.writeFile(wb, nombreArchivo);

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

  valorSelectDep(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    this.depto = selectElement.value == 'Selecciona departamento' ? '' : selectElement.value;
     
  }

  valorSelectA(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    this.anio = selectElement.value == 'Año' ? '' : selectElement.value;
     
  }

  valorSelectMes(event: Event): void {

    const selectElement = event.target as HTMLSelectElement; // Asegura que es un elemento <select>
    this.mes = selectElement.value == 'Mes' ? '' : selectElement.value;
     
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.consultar(this.user[0].emp_tipo);
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.consultar(this.user[0].emp_tipo); // Llama a la función del botón al presionar Enter
    }
  }

  consultar(tipo: string){
     this.datosColaborador = [];

    this.api.consultaReporteSolicitud(this.depto, this.anio, this.mes, this.consultaForm.value, tipo).subscribe(
      (response) => {
        const data =  response;
        this.solicitudes = data;
        this.solicitudes = this.solicitudes.map((ele: any)=>{
          ele.fecha_apartir = this.convertirFecha(ele.fecha_apartir);
          ele.fecha_hasta = this.convertirFecha(ele.fecha_hasta);
          return ele;
        });
        // this.solicitudes.forEach((ele: any) =>{
        //   ele.tipoSolicitud = ele.motivo.includes('Permiso')? 'Permiso' : ele.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
        //   ele.motivo = ele.tipoSolicitud == 'Vacaciones'? ele.motivo.substring(12,100) : ele.tipoSolicitud == 'Permiso'? ele.motivo.substring(9,100) : ele.tipoSolicitud == 'Pago tiempo por tiempo'? ele.motivo.substring(24,100) : ele.motivo;
          
        // })

        this.datosColaborador.push(this.solicitudes[0]);
        

        const total = this.solicitudes.reduce((acumulador: any, elemento: any) => acumulador + parseInt(elemento.cuantos_dias), 0);
        this.nDias = total;
        
        // this.solicitudes.map(sol => {
        //   this.diasUtilizados = sol.cuantos_dias++
        // })
        
      },
      (error) => {
           console.error('Error al obtener datos:', error);
         }

    );
  }

  datos(datos: any){

    this.solicitudesFilter = this.solicitudes.filter((ele: any) => ele.Clave == datos.Clave);

    const total = this.solicitudesFilter.reduce((acumulador: any, ele: any) => acumulador + parseInt(ele.cuantos_dias), 0);
    this.nDias = total;

    this.solicitudesFilter.forEach((ele: any) => {
        ele.sumaDias = this.nDias;
        ele.dis_Dias = parseInt(datos.Dias_disponibles) - this.nDias;
    });

    

    this.datosColaborador = [];
    if(this.datosColaborador = []){
     this.datosColaborador.push(datos);
    //  console.log(this.datosColaborador);
    }
    // console.log(this.solicitudes);
  }

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

  async loadAndPrintPDF() {
  const { default: pdfMake } = await import('pdfmake/build/pdfmake')
  const { default: pdfFonts } = await import('pdfmake/build/vfs_fonts')
  // @ts-expect-error: addVirtualFileSystem is not defined
  pdfMake.addVirtualFileSystem(pdfFonts)
  return pdfMake
}

  async generatePDFWithPdfMake(solicitud: any) {
    // console.log(solicitud);
    // const tipoSolicitud = solicitud.motivo.includes('Permiso')? 'Permiso' : solicitud.motivo.includes('Pago tiempo por tiempo')? 'Pago tiempo por tiempo' : 'Vacaciones';
    // solicitud.motivo = tipoSolicitud == 'Vacaciones'? solicitud.motivo.substring(12,100) : tipoSolicitud == 'Permiso'? solicitud.motivo.substring(9,100) : tipoSolicitud == 'Pago tiempo por tiempo'? solicitud.motivo.substring(24,100) : solicitud.motivo;
    const nom_emp = solicitud.nombre;
    const num_emp = solicitud.clave;

    const cgs = solicitud.con_sueldo == true? 'X' : '';
    const sgs = solicitud.sin_sueldo == true? 'X' : '';
    const s = solicitud.sindicalizado == true? 'X' : '';
    const ns = solicitud.no_sindicalizado == true? 'X' : '';

    const i = solicitud.firma_interesado != ''? 'Autorizó' : '';
    const ji = solicitud.firma_jefe_in != ''? 'Autorizó' : '';
    const g = solicitud.firms_gerente != ''? 'Autorizó' : '';

    const statusA = solicitud.status == 'Aceptado'? 'X' : solicitud.status == 'Completado'? 'X' : '';
    const statusR = solicitud.status != 'Rechazado'? '' : 'X';

    const rel = solicitud.status == 'Completado'? 'Autorizó' : '';

    // const dias = solicitud.Fecha_ingreso.substring(0,2);
    // const mes = solicitud.Fecha_ingreso.substring(3,5);
    // const año = solicitud.Fecha_ingreso.substring(6,10);
    // const formatoFecha = mes+'/'+dias+'/'+año;
    // console.log(solicitud.Fecha_ingreso, formatoFecha);
    
    const docDefinition = {
      content: [
        
         {
          columns: [
            {
              width: '25%',
              text: '',
            },
            {
              width: '50%',
              text: 'AUTORIZACION DE PERMISO', style: 'header',
            },
            {
              width: '25%',
              text: '',
            },
          ],
        },
        {
          columns: [
            {
              width: '10%',
              text: '',
            },
            {
              width: '80%',
              text: 'PARA USO EXCLUSIVO DEL DEPARTAMENTO INTERESADO', style: 'headerSub',
            },
            {
              width: '10%',
              text: '',
            },
          ],
        },
        // {
        //   table: {
        //     headerRows: 1,
        //     widths: ['*', 'auto', 100],
        //     body: [
        //       ['Header 1', 'Header 2', 'Header 3'],
        //       ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
        //       ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
        //     ],
        //   },
        // },
        {text: 'Fecha: ' + solicitud.fecha_solicitud, style: 'parrafo'},
        {text: 'Por medio del presente solicitamos se autorice a:' + ' ' + solicitud.nombre, style: 'parrafo'},
        {
          columns: [
            {
              width: '50%',
              text: 'Fecha de ingreso: ' + ' ' + this.obtenerFechaAlta(solicitud.Fecha_ingreso),
              style: 'parrafo'
            },
            {
              width: '20%',
              text: 'Años Cump: ' + ' ' + solicitud.Años,
              style: 'parrafo'
            },
            {
              width: '30%',
              text: 'No. Empleado: ' + ' ' + solicitud.clave,
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '65%',
              text: 'del Departamento de: ' + ' ' + solicitud.Departamento,
              style: 'parrafoVacio'
            },
            {
              width: '10%',
              text: '',
              style: 'parrafoVacio'
            },
            {
              width: '25%',
              text: 'Centro de Costos: ' + ' ' + solicitud.Depto,
              style: 'parrafoVacio'
            },
          ],
        },
        {text: 'Permiso para faltar a sus labores:', style: 'parrafo'},
        {
          stack: [
            {
              width: '25%',
              text: '[' + ' ' + cgs + ' ' + '] Con goce de sueldo',
            },
            {
              width: '25%',
              text: '[' + ' ' + sgs + ' ' + '] Sin goce de sueldo',
            },
            {
              width: '25%',
              text: '[' + ' ' + s + ' ' + '] Sindicalizado',
            },
            {
              width: '25%',
              text: '[' + ' ' + ns + ' ' + '] No Sindicalizado',
              style: 'parrafoFechas'
            },
          ],
        },
        {
          columns: [
            {
              width: '15%',
              text: 'Por: ' + solicitud.cuantos_dias + ' ' + 'día(s)',
              style: 'parrafoFechas'
            },
            {
              width: '40%',
              text: ',a partir del: ' + solicitud.fecha_apartir,
              style: 'parrafoFechas'
            },
            {
              width: '45%',
              text: 'al día: ' + solicitud.fecha_hasta + ' ' + 'inclusive',
              style: 'parrafoFechas'
            },
          ],
        },
        // {
        //   columns: [
        //     {
        //       width: '70%',
        //       text: 'al día: ' + solicitud.fecha_hasta + ' ' + 'inclusive',
        //       style: 'parrafo'
        //     },
        //   ],
        // },
        {
          columns: [
            // {
            //   width: '40%',
            //   text: 'Solicitud: ' + solicitud.tipo_solicitud,
            //   style: 'parrafoFirmas'
            // },
            {
              width: '100%',
              text: 'Motivo: ' + solicitud.motivo,
              style: 'parrafoMotivo'
            },
          ],
        },
        {
          columns: [
            {
              width: '15%',
              text: '',
              style: 'parrafoFirmas'
            },
            {
              width: '40%',
              text: 'Interesado [ ' + i + ' ' + ']',
              style: 'parrafoFirmas'
            },
            {
              width: '40%',
              text: 'Jefe Inmediato [ ' + ji + ' ' + ']',
              style: 'parrafoFirmas'
            },
            {
              width: '5%',
              text: '',
              style: 'parrafoFirmas'
            },
            // {
            //   width: '34%',
            //   text: 'Gerente [ ' + g + ' ' + ']',
            //   style: 'parrafoFirmas'
            // },
          ],
        },
        {
          columns: [
            {
              width: '13%',
              text: '',
              style: 'parrafoPequeño'
            },
            {
              width: '42%',
              text: solicitud.firma_interesado,
              style: 'parrafoPequeño'
            },
            {
              width: '38%',
              text: solicitud.firma_jefe_in,
              style: 'parrafoPequeño'
            },
            {
              width: '7%',
              text: '',
              style: 'parrafoPequeño'
            },
            // {
            //   width: '34%',
            //   text: solicitud.firms_gerente,
            //   style: 'parrafoPequeño'
            // },
          ],
        },
        {
          columns: [
            {
              width: '100%',
              text: '',
              style: 'parrafoVacio'
            },
          ],
        },
        {
          columns: [
            {
              width: '10%',
              text: '',
            },
            {
              width: '80%',
              text: 'PARA USO EXCLUSIVO DE RELACIONES INDUSTRIALES', style: 'headerSub',
            },
            {
              width: '10%',
              text: '',
            },
          ],
        },
        {
          columns: [
            {
              width: '33%',
              text: 'Contestación:',
              style: 'parrafo'
            },
            {
              width: '33%',
              text: 'Aceptado [ ' + statusA + ' ' + ']',
              style: 'parrafo'
            },
            {
              width: '34%',
              text: 'Rechazado [ ' + statusR + ' ' + ']',
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '25%',
              text: 'Número de días: ' + solicitud.cuantos_dias,
              style: 'parrafoNota'
            },
            {
              width: '38%',
              text: 'del día ' + solicitud.fecha_apartir,
              style: 'parrafoNota'
            },
            {
              width: '37%',
              text: 'al día ' + solicitud.fecha_hasta,
              style: 'parrafoNota'
            },
          ],
        },
        {text: 'Nota:', style: 'parrafo'},
        {text: '1.- Este aviso será valido, exclusivamente si está firmado por el departamento de personal, ya que este departamento mantiene el registro de los días de vacaciones por disfrutar.', style: 'parrafo'},
        {text: '2.- Este aviso debe de ser entregado en original y copia al departamento de personal.', style: 'parrafo'},
        {text: '3.- El departamento de personal lo regresará al interesado, indicando los días que le', style: 'parrafo'},
        {text:  'corresponden al trabajador.', style: 'parrafoFinal'},
        {
          columns: [
            {
              width: '33%',
              text: '',
              style: 'parrafo'
            },
            {
              width: '34%',
              text: 'Personal [ ' + rel + ' ' + ']',
              style: 'parrafo'
            },
            {
              width: '33%',
              text: '',
              style: 'parrafoFirmas'
            },
          ],
        },
        // {
        //   table: {
        //     headerRows: 1,
        //     widths: ['*', 'auto', 100],
        //     body: [
        //       ['Header 1', 'Header 2', 'Header 3'],
        //       ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
        //       ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
        //     ],
        //   },
        // },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          lineHeight: 2
        },
        headerSub: {
          fontSize: 14,
          bold: true,
          lineHeight: 3,
          
        },
        parrafo: {
          fontSize: 12,
          lineHeight: 1.5
        },
        parrafoFechas: {
          fontSize: 12,
          lineHeight: 3
        },
        parrafoPequeño: {
          fontSize: 9,
          lineHeight: 5
        },
        parrafoMotivo: {
          fontSize: 10,
          lineHeight: 3,
        },
        parrafoFirmas: {
          fontSize: 12,
          lineHeight: 1,
          // align: 'center'
        },
        parrafoVacio: {
          fontSize: 12,
          lineHeight: 3
        },
        parrafoNota: {
          fontSize: 12,
          lineHeight: 2
        },
        parrafoFinal: {
          fontSize: 12,
          lineHeight: 5
        },
      },
    };
      //pdfMake.createPdf(docDefinition).open(); // Abre el PDF en una nueva ventana
      const pdf = await this.loadAndPrintPDF();
      pdf.createPdf(docDefinition).download(num_emp+'_'+nom_emp+'.pdf'); // Descarga el PDF
  }

}
