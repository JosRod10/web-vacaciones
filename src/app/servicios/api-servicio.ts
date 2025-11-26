import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiServicio {
  private apiUrl = 'http://localhost:3000'; // Reemplazar con la URL de tu backend

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  addItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, item);
  }

  login(item: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/login`, item);
  }

  form(item: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/form`, item);
  }

  getSolicitudes(tipo: string, relacion: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/solicitudes`, {tipo, relacion});
  }

  aprobar(id: number, accion: number, dias_d: number, dias_u: number, clave: number, periodo?: string, correo?: string, nombre?: string, genera?: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/aprobar`, {id, accion, dias_d, dias_u, clave, periodo, correo, nombre, genera});
  }

  consultaReporteSolicitud(departamento: string, anio: string, mes: string, criterio: any, tipo: string, relacion: string): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/reporteSolicitud`, {departamento, anio, mes, criterio, tipo, relacion});
  }

  firmaJefeInmediato(item: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/firma-jefe-inmediato`, item);
  }

  firmaGerente(item: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/firma-gerente`, item);
  }

  getCoAsociados(clave: string, tipo: string, tipo_dep: string, depto: string){
        return this.http.post<any>(`${this.apiUrl}/colaboradores-asociados`, {clave, tipo, tipo_dep, depto});
  }

  aceptarRI(id: number): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/aceptar-ri`, {id});
  }

  getHistorial(clave: number): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/colaboradorHistorial`, {clave});
  }

  getHistorialColaboradotres(clave: number): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/colaboradoresHistorial`, {clave});
  }

  generarInhabil(item: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/generar-inhabil`, item);
  }

  accionTodas(claves: any, accion: number): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/accion-todas`, {claves, accion});
  }

  aceptarTodas(claves: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/aceptar-todas`, claves);
  }

  firmarTodasGerente(solicitudes: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/firmar-todas-gerente`, solicitudes);
  }

  firmarTodasRI(solicitudes: any): Observable<any> {
    // console.log("Entra");
    return this.http.post<any>(`${this.apiUrl}/firmar-todas-ri`, solicitudes);
  }

}
