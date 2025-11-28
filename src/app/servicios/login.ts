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
  cumplidos: number = 0;

  private token: string | null = null;

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
    // if(diaH < diaA && mesH < mesA){
    //   this.cumplidos = this.cumplidos;
    // }
    if(añoA == añoH){
      this.cumplidos = 0;
    }

    return this.cumplidos;

  }

  // auth.service.ts

  login(token: any, user: any) {
    this.token = token;
    localStorage.setItem('authToken', token); // O en cookies para más seguridad
    localStorage.setItem('Usuario', JSON.stringify(user));
    // console.log('Token almacenado');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('Usuario');
    localStorage.removeItem('misSolicitudes');
    // localStorage.removeItem('misObjetos');
    // console.log('Sesión cerrada');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }


}

