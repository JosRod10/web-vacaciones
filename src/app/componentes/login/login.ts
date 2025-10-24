import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServices } from '../../servicios/login';
import { User } from '../../interfaces/user';
import { Alertas } from '../alertas/validacionlogin/alertas';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiServicio } from '../../servicios/api-servicio';
import { SolicitudPendiente } from '../alertas/solicitud-pendiente/solicitud-pendiente';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  private apiUrl = 'http://localhost:3000'; // Reemplazar con la URL de tu backend
  // usuario = '';
  // contraseña = '';
  error = '';
  hidePassword = true;
  loginForm: FormGroup;
  user: User;
  items: any[] = [];
  alerta: boolean = false;
 
  constructor(private fb: FormBuilder, private api: ApiServicio, private authService: LoginServices, private router: Router, private dialog: MatDialog, private http: HttpClient) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.user = {
      user: '',
      pass: ''
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // console.log('Login exitoso', this.loginForm.value);
      // this.loginSQL();
      this.loginToken();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  async login() {
    
    const esValido = await this.authService.validarCredenciales(this.loginForm.value.user, this.loginForm.value.pass);
    
    if (esValido) {
      this.router.navigate(['form']);
    } else {
      this.abrirAlerta();
      this.error = 'Usuario o contraseña incorrectos';
      
    }
  }

  abrirAlerta() {
      const dialogRef = this.dialog.open(Alertas, {
        width: '500px',
        height: '150px',
        disableClose: false, // true para que no se cierre al hacer clic fuera
      });
  }

  abrirAlertaSolicitud() {
      const dialogRef = this.dialog.open(SolicitudPendiente, {
        width: '500px',
        height: '150px',
        disableClose: false, // true para que no se cierre al hacer clic fuera
      });
    }

  // cerrar(): void {
  //     this.dialogRef.close();
  // }

  async loginSQL(){
    this.user = {
      user: this.loginForm.value.user,
      pass: this.loginForm.value.pass
    }
    // console.log("Entra");

    // this.api.login(this.user).subscribe(addedItem => {
    //   this.items.push(addedItem);
    // });

    this.api.login(this.user).subscribe(
         (response) => {
          const data = response; // Asigna los datos recibidos a la variable 'data'
          // console.log("Usuario: ", data);
          if (data.length > 0 && data[0].Estatus_Solicitud != 'Pendiente') {
            localStorage.setItem('Usuario', JSON.stringify(data));
            if(data[0].Tipo == 'C'){
              this.router.navigate(['solicitud']);
            }
            if(data[0].Tipo == 'RI' || data[0].Tipo == 'JI' || data[0].Tipo == 'G'){
              this.router.navigate(['panel-solicitud']);
            }
            if(data[0].Tipo == 'S' || data[0].Tipo == 'RIA'){
              this.router.navigate(['solicitud']);
            }
            
          }else if(data.length > 0 && data[0].Estatus_Solicitud == 'Pendiente'){
            this.alerta = true,     
            setTimeout(() => {
              this.alerta = false;
              this.loginForm.get('user')?.setValue('');
              this.loginForm.get('pass')?.setValue('');
            }, 4000); // 4000 milisegundos = 4 segundos

          } else {
            this.abrirAlerta();
            this.error = 'Usuario o contraseña incorrectos';
            
          }
         },
         (error) => {
           console.error('Error al obtener datos:', error);
         }
    );
        
  }

  async loginToken(){
    // En tu componente de login
      // ... (envía credenciales a la API)
      this.user = {
      user: this.loginForm.value.user,
      pass: this.loginForm.value.pass
    }
      this.api.login(this.user).subscribe(
        (response)=>{
          const data = response.result;
          const token = response.token;
          if (token) {
            this.authService.login(token, data);
            if(data[0].Tipo == 'C'){
                this.router.navigate(['solicitud']);
            }
            if(data[0].Tipo == 'RI' || data[0].Tipo == 'JI' || data[0].Tipo == 'G'){
                this.router.navigate(['panel-solicitud']);
            }
            if(data[0].Tipo == 'S' || data[0].Tipo == 'RIA'){
                this.router.navigate(['solicitud']);
            }
          }
          // if(!token && data.length > 0 && data[0].Estatus_Solicitud == 'Pendiente'){
          //   this.alerta = true,     
          //   setTimeout(() => {
          //     this.alerta = false;
          //     this.loginForm.get('user')?.setValue('');
          //     this.loginForm.get('pass')?.setValue('');
          //   }, 4000); // 4000 milisegundos = 4 segundos

          // } 
          if(!token) {
            this.abrirAlerta();
            this.error = 'Usuario o contraseña incorrectos';
            
          }
        },
        (err)=>{
          console.log(err);
        }
      );
    
  }

}

