import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { ApiServicio } from './api-servicio';

@Injectable({
  providedIn: 'root'
})
export class LoginServices {
  constructor(private http: HttpClient, private api: ApiServicio) {}

  // async validarCredenciales(usuario: string, contraseña: string): Promise<boolean> {
    
  //   const file = await firstValueFrom(this.http.get('assets/credenciales.xlsx', { responseType: 'blob' }));
  //   const data = await file.arrayBuffer();
  //   const workbook = XLSX.read(data, { type: 'array' });
  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //   // Accedemos a la fila 1 (índice 1, ya que fila 0 es encabezado)
  //   const fila = jsonData[1]; // ['admin', '1234']

  //   const usuarioExcel = fila[0];
  //   const contraseñaExcel = fila[1];
  //   console.log(usuarioExcel, contraseñaExcel)

  //   return usuario == usuarioExcel && contraseña == contraseñaExcel;
  // }
  async validarCredenciales(usuario: string, contraseña: string): Promise<boolean> {
      const file = await firstValueFrom(this.http.get('assets/credenciales.xlsx', { responseType: 'blob' }));
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Recorrer desde la segunda fila (índice 1) en adelante
      for (let i = 1; i < jsonData.length; i++) {
        const fila = jsonData[i];
        const usuarioExcel = fila[0]?.toString().trim();
        const contraseñaExcel = fila[1]?.toString().trim();

        if (usuario === usuarioExcel && contraseña === contraseñaExcel) {
          return true;
        }
      }

      return false;
  }

}

