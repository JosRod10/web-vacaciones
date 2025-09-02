import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cerrarsesion } from '../alertas/cerrarsesion/cerrarsesion';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiServicio } from '../../servicios/api-servicio';
import * as XLSX from 'xlsx';
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
  nDias: number = 0;
  reporte_solicitudes: any[] = [];

  constructor(private dialog: MatDialog, private router: Router, private fb: FormBuilder, private api: ApiServicio){

    this.consultaForm = this.fb.group({
      criterio: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('Usuario') || '{}');
  }

  descargarExcel(){

      this.solicitudes.map((ele: any)=> {
        const solicitud = {
          Clave: ele.Clave,
          Nombre: ele.Nombre_completo,
          Departamento: ele.Departamento,
          Puesto: ele.Puesto,
          Fecha_de_ingreso: ele.Fecha_de_alta,
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

      // 3. Genera y descarga el archivo XLSX
      const nombreArchivo = 'reporte_solicitudes_vacaciones.xlsx';
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

  consultar(){
    this.api.consultaReporteSolicitud(this.consultaForm.value).subscribe(
      (response) => {
        const data =  response;
        this.solicitudes = data;

        const total = this.solicitudes.reduce((acumulador: any, elemento: any) => acumulador + parseInt(elemento.cuantos_dias), 0);
        this.nDias = total;
        console.log(this.nDias); // Output: 175
        // this.solicitudes.map(sol => {
        //   this.diasUtilizados = sol.cuantos_dias++
        // })
        console.log(data);
      },
      (error) => {
           console.error('Error al obtener datos:', error);
         }

    );
  }

  obtenerFechaAlta(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate()+1;
    const mes = fecha.toLocaleString('default', { month: 'long' });
    const año = fecha.getFullYear();

    return `${dia} de ${mes} del ${año}`;
  }

  async loadAndPrintPDF() {
  const { default: pdfMake } = await import('pdfmake/build/pdfmake')
  const { default: pdfFonts } = await import('pdfmake/build/vfs_fonts')
  // @ts-expect-error: addVirtualFileSystem is not defined
  pdfMake.addVirtualFileSystem(pdfFonts)
  return pdfMake
}

  async generatePDFWithPdfMake(solicitud: any) {

    const cgs = solicitud.con_sueldo == true? 'X' : '';
    const sgs = solicitud.sin_sueldo == true? 'X' : '';
    const s = solicitud.sindicalizado == true? 'X' : '';
    const ns = solicitud.no_sindicalizado == true? 'X' : '';

    const i = solicitud.firma_interesado == 'true'? 'Autorizó' : '';
    const ji = solicitud.firma_jefe_in == 'true'? 'Autorizó' : '';
    const g = solicitud.firms_gerente == 'true'? 'Autorizó' : '';

    const statusA = solicitud.status != 'Aceptado'? '' : 'X';
    const statusR = solicitud.status != 'Rechazado'? '' : 'X';

    const rel = solicitud.status == 'Aceptado'? 'Autorizó' : '';
    
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
              text: 'Fecha de ingreso: ' + ' ' + this.obtenerFechaAlta(solicitud.Fecha_de_alta),
              style: 'parrafo'
            },
            {
              width: '25%',
              text: 'Años Cump: 0',
              style: 'parrafo'
            },
            {
              width: '25%',
              text: 'No. Tarjeta: ' + ' ' + solicitud.clave,
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '65%',
              text: 'del Departamento de: ' + ' ' + solicitud.Departamento,
              style: 'parrafo'
            },
            {
              width: '10%',
              text: '',
              style: 'parrafo'
            },
            {
              width: '25%',
              text: 'Centro de Costos: 304',
              style: 'parrafo'
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
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '30%',
              text: 'Por: ' + solicitud.cuantos_dias + ' ' + 'día(s)',
              style: 'parrafo'
            },
            {
              width: '70%',
              text: ',a partir del: ' + solicitud.fecha_apartir,
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '45%',
              text: 'al día: ' + solicitud.fecha_hasta + ' ' + 'inclusive',
              style: 'parrafo'
            },
          ],
        },
        {
          columns: [
            {
              width: '100%',
              text: 'Motivo: ' + solicitud.motivo,
              style: 'parrafoFirmas'
            },
          ],
        },
        {
          columns: [
            {
              width: '33%',
              text: 'Interesado [ ' + i + ' ' + ']',
              style: 'parrafo'
            },
            {
              width: '33%',
              text: 'Jefe Inmediato [ ' + ji + ' ' + ']',
              style: 'parrafo'
            },
            {
              width: '34%',
              text: 'Gerente [ ' + g + ' ' + ']',
              style: 'parrafoFirmas'
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
              style: 'parrafoFirmas'
            },
            {
              width: '38%',
              text: 'del día ' + solicitud.fecha_apartir,
              style: 'parrafoFirmas'
            },
            {
              width: '37%',
              text: 'al día ' + solicitud.fecha_hasta,
              style: 'parrafoFirmas'
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
          lineHeight: 3
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
        parrafoFirmas: {
          fontSize: 12,
          lineHeight: 3
        },
        parrafoFinal: {
          fontSize: 12,
          lineHeight: 5
        },
      },
    };
      //pdfMake.createPdf(docDefinition).open(); // Abre el PDF en una nueva ventana
      const pdf = await this.loadAndPrintPDF();
      pdf.createPdf(docDefinition).download('solicitud-autorizacion-permiso.pdf'); // Descarga el PDF
  }

}
